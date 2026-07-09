import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';

export default function PlanCanvas({ floors, currentFloor, onDragEnd, stageRef, showDimensions=true, showDoors=true, showWindows=true }) {
  const localRef = useRef();
  const width = 1200;
  const height = 800;
  const scale = 60; // px per meter, keep consistent with generator

  useEffect(() => {
    if (stageRef) stageRef.current = localRef.current;
  }, [stageRef]);

  const rooms = (floors && floors[currentFloor]) ? floors[currentFloor] : [];

  function renderDimensions(r) {
    const dims = [];
    const pad = 6;
    // horizontal dimension above room
    const x1 = r.x;
    const x2 = r.x + r.w;
    const y = r.y - 18;
    const widthM = Math.round((r.w / scale) * 1000); // mm
    dims.push(<Line key={`dim-h-${r.id}`} points={[x1, y, x2, y]} stroke="#2b2b2b" strokeWidth={1} />);
    dims.push(<Text key={`dim-ht-${r.id}`} text={`${widthM} mm`} x={(x1+x2)/2 - 24} y={y-14} fontSize={12} fill="#2b2b2b" />);
    // vertical dimension left of room
    const vy1 = r.y;
    const vy2 = r.y + r.h;
    const vx = r.x - 30;
    const heightM = Math.round((r.h / scale) * 1000); // mm
    dims.push(<Line key={`dim-v-${r.id}`} points={[vx, vy1, vx, vy2]} stroke="#2b2b2b" strokeWidth={1} />);
    dims.push(<Text key={`dim-vt-${r.id}`} text={`${heightM} mm`} x={vx-6} y={(vy1+vy2)/2 - 6} fontSize={12} fill="#2b2b2b" rotation={270} />);
    return dims;
  }

  return (
    <Stage width={width} height={height} ref={localRef} style={{border:'1px solid #ddd', background:'#fff'}}>
      <Layer>
        <Rect x={10} y={10} width={width-20} height={height-20} stroke="#999" dash={[4,4]} />
        {rooms.map(r => (
          <Group key={r.id}>
            <Group x={r.x} y={r.y} draggable={!r.isStair} onDragEnd={e => { if(!r.isStair) onDragEnd(r.id, e.target.x(), e.target.y()); }}>
              <Rect
                x={0} y={0}
                width={r.w} height={r.h}
                fill={r.isStair? '#f5f3c3' : '#ffffff'}
                stroke={r.isStair? '#b58900' : '#222'}
                strokeWidth={r.isStair? 2:3}
                cornerRadius={4}
                shadowColor="#000"
                shadowBlur={6}
                shadowOpacity={0.06}
              />
              <Text text={`${r.name}`} x={6} y={6} fontSize={16} fill="#111" />
              <Text text={`${r.area} m²`} x={6} y={28} fontSize={12} fill="#555" />
              {r.isStair && <Text text={`楼梯`} x={6} y={46} fontSize={12} fill="#b58900" />}

              {/* doors as children of draggable group: use coordinates relative to room */}
              {showDoors && r.doors && r.doors.map((d, idx) => (
                <Rect key={`door-${r.id}-${idx}`} x={Math.max(0, d.x - r.x)} y={Math.max(0, d.y - r.y)} width={d.w} height={d.h} fill="#6b4f2a" cornerRadius={2} />
              ))}

              {/* windows as children of draggable group: use coordinates relative to room */}
              {showWindows && r.windows && r.windows.map((w, idx) => (
                <Rect key={`win-${r.id}-${idx}`} x={Math.max(0, w.x - r.x)} y={Math.max(0, w.y - r.y)} width={w.w} height={w.h} fill="#cfeffd" stroke="#5fb0e6" strokeWidth={1} cornerRadius={2} />
              ))}

            </Group>

            {/* dimensions remain absolute so they follow stage coordinates */}
            {showDimensions && renderDimensions(r)}
          </Group>
        ))}
      </Layer>
    </Stage>
  );
}
