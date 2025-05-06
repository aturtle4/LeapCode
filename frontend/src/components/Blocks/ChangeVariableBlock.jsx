import React, { useState } from 'react';

function ChangeVariableBlock({ block }) {
  const [name, setName] = useState(block.name || '');
  const [value, setValue] = useState(block.value || '');
  const isUnconnected = !block.parentId && !block.childId;

  const style = {
    padding: '8px 12px',
    backgroundColor: block.color || '#27AE60',
    color: 'white',
    width: '150px',
    borderRadius: '5px',
    opacity: isUnconnected ? 0.6 : 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  return (
    <div style={style}>
      <div style={{ fontWeight: 'bold' }}>{block.label}</div>
      <input
        type="text"
        placeholder="Variable Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: '100%',
          padding: '4px',
          fontSize: '12px',
          borderRadius: '4px',
          border: 'none',
        }}
      />
      <input
        type="text"
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: '100%',
          padding: '4px',
          fontSize: '12px',
          borderRadius: '4px',
          border: 'none',
        }}
      />
    </div>
  );
}

export default ChangeVariableBlock;