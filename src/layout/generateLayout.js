// 扩展为支持 multi-layer and add doors/windows metadata
export default function generateLayout(floors, maxWidthPx = 1000, scale = 60) {
  const margin = 20;
  const padding = 8;
  const layoutsByFloor = {};
  const floorNumbers = [];
  // stair global alignment
  let stairCoords = null; // {x,y,w,h}
  const stairSizeM = { w: 2, h: 3 }; // meters default
  const stairPx = { w: Math.round(stairSizeM.w * scale), h: Math.round(stairSizeM.h * scale) };

  for (const fl of floors) {
    floorNumbers.push(fl.level);
    const rooms = fl.rooms || [];
    // estimate sizes
    const items = rooms.map((r, idx) => {
      const approxWidthM = Math.max(1.5, Math.sqrt((r.area||10)) * 1.2);
      const approxHeightM = Math.max(1.2, (r.area||10) / approxWidthM);
      const w = Math.round(approxWidthM * scale);
      const h = Math.round(approxHeightM * scale);
      return { id: `${fl.level}-${idx}-${Math.random().toString(36).slice(2,6)}`, name: r.name, area: r.area, w, h };
    });

    // place greedily row by row
    let cursorX = margin;
    let cursorY = margin;
    let rowHeight = 0;
    const placed = [];
    items.sort((a,b) => b.w*b.h - a.w*a.h);
    for (const it of items) {
      if (cursorX + it.w + margin > maxWidthPx) {
        cursorX = margin;
        cursorY += rowHeight + padding;
        rowHeight = 0;
      }
      placed.push({...it, x: cursorX, y: cursorY});
      cursorX += it.w + padding;
      if (it.h > rowHeight) rowHeight = it.h;
    }

    // add stair if requested
    if (fl.stair && fl.stair.position) {
      if (!stairCoords) {
        const pos = fl.stair.position;
        let sx = margin, sy = margin;
        if (pos === 'east') sx = maxWidthPx - margin - stairPx.w;
        else if (pos === 'west') sx = margin;
        else if (pos === 'south') sx = Math.round((maxWidthPx - stairPx.w)/2);
        else if (pos === 'north') sx = Math.round((maxWidthPx - stairPx.w)/2);
        else sx = Math.round((maxWidthPx - stairPx.w)/2);
        stairCoords = { x: sx, y: margin, w: stairPx.w, h: stairPx.h };
      }
      placed.push({ id: `${fl.level}-stair`, name: '楼梯', area: stairSizeM.w*stairSizeM.h, x: stairCoords.x, y: stairCoords.y, w: stairCoords.w, h: stairCoords.h, isStair:true });
    }

    // add doors/windows heuristically
    const doorM = 0.9; // door width in meters
    const windowM = 1.2; // window width meters
    const doorPx = Math.max(24, Math.round(doorM * scale));
    const windowPx = Math.max(36, Math.round(windowM * scale));

    const withOpenings = placed.map(p => {
      const room = {...p};
      // default door on bottom center (unless stair occupies)
      const door = { side: 'bottom', w: doorPx, h: 6, x: p.x + Math.round((p.w - doorPx)/2), y: p.y + p.h - 3 };
      // window heuristic: bedrooms and living rooms get windows on top center
      let wantWindow = /卧室|客厅|厅|起居/.test((p.name||''));
      if (wantWindow) {
        const win = { side: 'top', w: Math.min(windowPx, p.w-10), h: 6, x: p.x + Math.round((p.w - Math.min(windowPx, p.w-10))/2), y: p.y - 3 };
        room.windows = [win];
      } else {
        room.windows = [];
      }
      room.doors = [door];
      return room;
    });

    layoutsByFloor[fl.level] = withOpenings.map(p => ({ id: p.id, name: p.name, area: p.area, x: p.x, y: p.y, w: p.w, h: p.h, isStair: p.isStair||false, doors: p.doors||[], windows: p.windows||[] }));
  }

  return { layoutsByFloor, floorNumbers };
}
