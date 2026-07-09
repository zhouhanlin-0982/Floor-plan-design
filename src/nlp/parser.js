// 保守中文解析器：将一句话分解为 floor -> rooms

function chineseNumberToInt(ch) {
  if (!ch) return null;
  const map = { '一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10 };
  if (/^\d+$/.test(ch)) return parseInt(ch,10);
  if (map[ch]) return map[ch];
  return null;
}

function extractFloors(text) {
  // Normalize punctuation
  const norm = text.replace(/；/g,';').replace(/，/g,',').replace(/：/g,':');
  // Split by ; or newlines
  const parts = norm.split(/;|\n/).map(p=>p.trim()).filter(Boolean);
  const floors = [];
  const warnings = [];

  for (const part of parts) {
    // find floor marker
    let m = part.match(/(?:第?\s*([一二三四五六七八九十\d]+)\s*(?:楼|层)|([\d]+)\s*[Ff])/);
    let level = null;
    let rest = part;
    if (m) {
      const raw = m[1] || m[2];
      level = chineseNumberToInt(raw);
      rest = part.slice(m.index + m[0].length).trim().replace(/^[:：\s]+/, '');
    } else {
      // if no explicit floor marker and floors empty, assume first is 1
      if (floors.length===0) level = 1;
    }

    if (level===null) {
      warnings.push(`未识别到楼层编号于段: "${part.slice(0,40)}"，已尝试按一楼处理`);
      level = 1;
      rest = part;
    }

    floors.push({ level, text: rest });
  }

  return { floors, warnings };
}

function parseRoomSpecs(floorText) {
  const rooms = [];
  // patterns:
  // 1) 名称 数字 (如: 客厅25)
  const regex1 = /(\S+?)\s*(\d+(?:\.\d+)?)(?:\s*m2|m²|m|㎡)?/g;
  let m;
  const used = new Set();
  while ((m = regex1.exec(floorText)) !== null) {
    const name = m[1].replace(/[,，;:：]/g,'').trim();
    const area = parseFloat(m[2]);
    rooms.push({ name, area });
    used.add(m.index);
  }

  // 2) 多间写法： 卧室3间12、10、10 或 卧室三间 12,10,10
  const regex2 = /(\S+?)\s*(\d+)\s*间\s*([\d、,，\s]+)/g;
  while ((m = regex2.exec(floorText)) !== null) {
    const baseName = m[1].trim();
    const count = parseInt(m[2],10);
    const list = m[3].trim().split(/[、,，\s]+/).filter(Boolean).map(s=>parseFloat(s));
    if (list.length>0) {
      for (let i=0;i<Math.min(count,list.length);i++) {
        rooms.push({ name: baseName, area: list[i] });
      }
      if (count>list.length) {
        for (let i=list.length;i<count;i++) rooms.push({ name: baseName, area: Math.round(10) });
      }
    } else {
      for (let i=0;i<count;i++) rooms.push({ name: baseName, area: Math.round(10) });
    }
  }

  // If no explicit sizes found but phrases like '卧室3间' exist
  const regex3 = /(\S+?)\s*(\d+)\s*间(?![\d、,，])/g;
  while ((m = regex3.exec(floorText)) !== null) {
    const baseName = m[1].trim();
    const count = parseInt(m[2],10);
    for (let i=0;i<count;i++) rooms.push({ name: baseName, area: 10 });
  }

  // If still empty try to split by comma words like '客厅, 厨房, 卫生间' without sizes
  if (rooms.length===0) {
    const simpleList = floorText.split(/[,，\/\s]+/).map(s=>s.trim()).filter(Boolean);
    // if elements are names without numbers and count small, add with default area
    const hasNumber = simpleList.some(it=>/\d/.test(it));
    if (!hasNumber && simpleList.length>0 && simpleList.length<=10) {
      for (const name of simpleList) {
        // ignore keywords '楼梯' here
        if (/楼梯/.test(name)) continue;
        rooms.push({ name, area: 10 });
      }
    }
  }

  return rooms;
}

export default function parseFloors(text) {
  const { floors, warnings } = extractFloors(text);
  const resultFloors = [];
  const outWarnings = [...warnings];
  for (const f of floors) {
    const ft = f.text || '';
    const floor = { level: f.level, rooms: [], stair: null };
    // detect stair position
    const stairMatch = ft.match(/楼梯\s*(在|在于)?\s*(东|西|南|北|中|中间|东侧|西侧|南侧|北侧)/);
    if (stairMatch) {
      const posRaw = stairMatch[2];
      let pos = null;
      if (/东/.test(posRaw)) pos='east';
      else if (/西/.test(posRaw)) pos='west';
      else if (/南/.test(posRaw)) pos='south';
      else if (/北/.test(posRaw)) pos='north';
      else pos='center';
      floor.stair = { position: pos };
    }

    const rooms = parseRoomSpecs(ft);
    if (rooms.length===0) outWarnings.push(`在楼层 ${f.level} 未解析到房间，请检查输入。`);
    floor.rooms = rooms;
    resultFloors.push(floor);
  }

  return { floors: resultFloors, warnings: outWarnings };
}
