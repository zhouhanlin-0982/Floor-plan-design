import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';

export default function PlanCanvas({ floors, currentFloor, onDragEnd, stageRef }) {
  const localRef = useRef();
  const width = 1200;
  const height = 800;

  useEffect(() => {
    if (stageRef) stageRef.current = localRef.current;
  }, [stageRef]);

  const rooms = (floors && floors[currentFloor]) ? floors[currentFloor] : [];

  return (
    <Stage width={width} height={height} ref={localRef} style={{border:'1px solid #ddd', background:'#fff'}}>
      <Layer>
        <Rect x={10} y={10} width={width-20} height={height-20} stroke="#999" dash={[4,4]} />
        {rooms.map(r => (
          <Group key={r.id} x={r.x} y={r.y} draggable={!r.isStair} onDragEnd={e => { if(!r.isStair) onDragEnd(r.id, e.target.x(), e.target.y()); }}>
            <Rect
              x={0} y={0}
              width={r.w} height={r.h}
              fill={r.isStair? '#f5f3c3' : '#fff'}
              stroke={r.isStair? '#b58900' : '#222'}
              strokeWidth={r.isStair? 2:3}
              cornerRadius={3}
              shadowColor="#000"
              shadowBlur={4}
              shadowOpacity={0.06}
            />
            <Text text={`${r.name}`} x={6} y={6} fontSize={16} fill="#111" />
            <Text text={`${r.area} m²`} x={6} y={28} fontSize={12} fill="#555" />
            {r.isStair && <Text text={`楼梯`} x={6} y={46} fontSize={12} fill="#b58900" />}
          </Group>
        ))}
      </Layer>
    </Stage>
  );
}
