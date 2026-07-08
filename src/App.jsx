import React, { useState, useRef } from 'react';
import RoomForm from './components/RoomForm.jsx';
import PlanCanvas from './components/PlanCanvas.jsx';
import generateLayout from './layout/generateLayout.js';
import './index.css';

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [layoutRooms, setLayoutRooms] = useState([]);
  const stageRef = useRef();

  function addRoom(room) {
    setRooms(r => [...r, { id: Date.now().toString(), ...room }]);
  }

  function removeRoom(id) {
    setRooms(r => r.filter(x => x.id !== id));
  }

  function generate() {
    const stageW = 1200;
    const margin = 20;
    const scale = 60; // px per meter
    const layout = generateLayout(rooms, stageW - margin * 2, scale);
    setLayoutRooms(layout);
  }

  function updateRoomPos(id, x, y) {
    setLayoutRooms(r => r.map(room => room.id === id ? {...room, x, y} : room));
  }

  async function exportPNG() {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'floorplan.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="app">
      <div className="panel">
        <h3>房间输入（示例 MVP）</h3>
        <RoomForm onAdd={addRoom} />
        <div className="room-list">
          <h4>当前房间</h4>
          {rooms.length === 0 && <div>还没有房间，先添加几个（如：客厅 25，厨房 8）</div>}
          {rooms.map(r => (
            <div key={r.id} className="room-item">
              <div style={{flex:1}}>
                <strong>{r.name}</strong> · {r.area} m²
              </div>
              <button className="button small" onClick={() => removeRoom(r.id)}>删除</button>
            </div>
          ))}
        </div>

        <div style={{marginTop:12}}>
          <button className="button" onClick={generate}>生成平面图</button>
          <button className="button small" style={{marginLeft:8, background:'#28a745'}} onClick={exportPNG}>导出 PNG</button>
        </div>

        <div style={{marginTop:12, fontSize:13, color:'#555'}}>
          <strong>说明：</strong>
          <ul>
            <li>自动布局为简易贪心矩形摆放，仅作草图。</li>
            <li>可在画布上拖拽房间调整位置，点击并拖动右下角改变房间大小（扩展可做）。</li>
            <li>后续可加入门窗、尺寸标注、DXF/IFC 导出与多层支持。</li>
          </ul>
        </div>
      </div>

      <div className="canvasPanel">
        <h3>平面图画布</h3>
        <PlanCanvas
          rooms={layoutRooms}
          onDragEnd={updateRoomPos}
          stageRef={stageRef}
        />
      </div>
    </div>
  );
}
