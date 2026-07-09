import parseFloors from './nlp/parser.js';
import React, { useState, useRef } from 'react';
import PlanCanvas from './components/PlanCanvas.jsx';
import generateLayout from './layout/generateLayout.js';
import './index.css';

export default function App() {
  const [rawText, setRawText] = useState('一楼：客厅25，厨房8，卫生间4；二楼：卧室12、10、10，卫生间4，楼梯东侧');
  const [layouts, setLayouts] = useState({});
  const [currentFloor, setCurrentFloor] = useState(1);
  const [floorsList, setFloorsList] = useState([1]);
  const [messages, setMessages] = useState([]);
  const stageRef = useRef();

  function handleParseAndGenerate() {
    setMessages([]);
    const { floors, warnings } = parseFloors(rawText);
    if (warnings && warnings.length) setMessages(warnings);
    if (!floors || floors.length === 0) {
      setMessages(prev => [...prev, '未识别到楼层，请按示例格式输入（例如：一楼：客厅25，厨房8；二楼：卧室12、10、10）']);
      return;
    }
    // limit to 1-3 floors
    const filtered = floors.filter(f => f.level >=1 && f.level <=3).slice(0,3);
    const generated = generateLayout(filtered, 1000, 60);
    setLayouts(generated.layoutsByFloor || {});
    setFloorsList(generated.floorNumbers || filtered.map(f=>f.level));
    setCurrentFloor(generated.floorNumbers && generated.floorNumbers[0] ? generated.floorNumbers[0] : filtered[0].level);
    if (warnings && warnings.length) setMessages(prev=>[...prev, ...warnings]);
  }

  function onDragEnd(id, x, y) {
    setLayouts(prev => {
      const copy = {...prev};
      const list = copy[currentFloor].map(r => r.id === id ? {...r, x, y} : r);
      copy[currentFloor] = list;
      return copy;
    });
  }

  async function exportPNG() {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `floor-${currentFloor}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="app">
      <div className="panel">
        <h3>快速输入（手机优先）</h3>
        <div style={{marginBottom:8}}>
          <label>用一句话描述户型（示例已预填）</label>
          <textarea className="input big" rows={6} value={rawText} onChange={e=>setRawText(e.target.value)} />
        </div>
        <div style={{display:'flex', gap:8, marginBottom:8}}>
          <button className="button" onClick={handleParseAndGenerate}>解析并生成</button>
          <button className="button" style={{background:'#6c757d'}} onClick={()=>{setRawText('一楼：客厅25，厨房8，卫生间4；二楼：卧室12、10、10，卫生间4，楼梯东侧'); setMessages([])}}>示例</button>
        </div>

        <div style={{marginTop:8}}>
          <h4>楼层</h4>
          <div style={{display:'flex', gap:8}}>
            {floorsList.map(f => (
              <button key={f} className={`button small ${f===currentFloor? 'active':''}`} onClick={()=>setCurrentFloor(f)}>{f}F</button>
            ))}
          </div>
        </div>

        <div style={{marginTop:12}}>
          <h4>提示</h4>
          <div style={{color:'#555', fontSize:13}}>
            <ul>
              <li>支持格式示例：一楼：客厅25，厨房8，卫生间4；二楼：卧室12、10、10，卫生间4，楼梯东侧</li>
              <li>解析为草图，生成后可在画布上拖拽微调。若解析失败会给出提示，请按示例调整输入。</li>
            </ul>
            {messages.length>0 && (
              <div style={{marginTop:8, color:'#b5533a'}}>
                <strong>解析提示：</strong>
                <ul>
                  {messages.map((m,i)=>(<li key={i}>{m}</li>))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div style={{marginTop:12}}>
          <button className="button" onClick={exportPNG} style={{background:'#28a745'}}>导出当前楼层 PNG</button>
        </div>
      </div>

      <div className="canvasPanel">
        <h3>平面图画布</h3>
        <PlanCanvas
          floors={layouts}
          currentFloor={currentFloor}
          onDragEnd={onDragEnd}
          stageRef={stageRef}
        />
      </div>
    </div>
  );
}
