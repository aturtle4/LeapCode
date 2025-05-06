import React, { useState } from 'react';

function AddBlock({ block }) {
  const [left, setLeft] = useState(block.left || '');
  const [right, setRight] = useState(block.right || '');
  const isUnconnected = !block.parentId && !block.childId;

  const style = {
    padding: '8px 12px',
    backgroundColor: block.color || '#F1C40F',
    color: 'white',
    width: '150px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    opacity: isUnconnected ? 0.6 : 1,
    gap: '4px',
  };

  return (
    <div style={style}>
      <div style={{ fontWeight: 'bold' }}>{block.label}</div>
      <input
        type="text"
        placeholder="Left Value"
        value={left}
        onChange={(e) => setLeft(e.target.value)}
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
        placeholder="Right Value"
        value={right}
        onChange={(e) => setRight(e.target.value)}
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

export default AddBlock;