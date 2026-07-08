import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';

export default function PlanCanvas({ rooms, onDragEnd, stageRef }) {
  const localRef = useRef();
  const width = 1200;
  const height = 800;

  useEffect(() => {
    if (stageRef) stageRef.current = localRef.current;
  }, [stageRef]);

  return (
    <Stage width={width} height={height} ref={localRef} style={{border:'1px solid #ddd', background:'#fafafa'}}>
      <Layer>
        {/* floor bounding */}
        <Rect x={10} y={10} width={width-20} height={height-20} stroke="#999" dash={[4,4]} />
        {rooms.map(r => (
          <Group key={r.id} x={r.x} y={r.y} draggable onDragEnd={e => {
            onDragEnd(r.id, e.target.x(), e.target.y());
          }}>
            <Rect
              x={0} y={0}
              width={r.w} height={r.h}
              fill="#fff"
              stroke="#222"
              strokeWidth={3}
              cornerRadius={3}
              shadowColor="#000"
              shadowBlur={4}
              shadowOpacity={0.08}
            />
            <Text text={`${r.name}`} x={6} y={6} fontSize={16} fill="#111" />
            <Text text={`${r.area} m²`} x={6} y={28} fontSize={12} fill="#555" />
          </Group>
        ))}
      </Layer>
    </Stage>
  );
}
