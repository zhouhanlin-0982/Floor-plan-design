import React, { useState } from 'react';

export default function RoomForm({ onAdd }) {
  const [name, setName] = useState('');
  const [area, setArea] = useState('');

  function submit(e) {
    e && e.preventDefault();
    const a = parseFloat(area);
    if (!name || isNaN(a) || a <= 0) {
      alert('请填写房间名称和有效面积（平方米）。');
      return;
    }
    onAdd({ name, area: a });
    setName('');
    setArea('');
  }

  return (
    <form onSubmit={submit}>
      <div style={{marginBottom:8}}>
        <label>房间名称</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="例如：客厅" />
      </div>
      <div style={{marginBottom:8}}>
        <label>面积（m²）</label>
        <input className="input" value={area} onChange={e=>setArea(e.target.value)} placeholder="例如：25" />
      </div>
      <div>
        <button type="button" className="button" onClick={submit}>添加房间</button>
      </div>
    </form>
  );
}
