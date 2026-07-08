// 简单贪心布局：把房间视为矩形按面积估计长宽，逐行放置
export default function generateLayout(rooms, maxWidthPx = 1000, scale = 60) {
  // rooms: [{id, name, area}]
  // scale: px per meter
  const margin = 20;
  const padding = 8;
  const placed = [];
  let cursorX = margin;
  let cursorY = margin;
  let rowHeight = 0;

  // Defensive copy & estimate size
  const items = rooms.map(r => {
    // estimate: 1.2 aspect ratio
    const approxWidthM = Math.max(1.5, Math.sqrt(r.area) * 1.2);
    const approxHeightM = Math.max(1.2, r.area / approxWidthM);
    const w = Math.round(approxWidthM * scale);
    const h = Math.round(approxHeightM * scale);
    return {...r, w, h};
  });

  // sort large to small for better packing
  items.sort((a,b) => b.w*b.h - a.w*a.h);

  for (const it of items) {
    if (cursorX + it.w + margin > maxWidthPx) {
      // wrap
      cursorX = margin;
      cursorY += rowHeight + padding;
      rowHeight = 0;
    }
    // place
    placed.push({...it, x: cursorX, y: cursorY});
    cursorX += it.w + padding;
    if (it.h > rowHeight) rowHeight = it.h;
  }

  // ensure final placements are integers and include original area
  return placed.map(p => ({ id: p.id, name: p.name, area: p.area, x: p.x, y: p.y, w: p.w, h: p.h }));
}
