import React, { useState, useEffect } from 'react';

function UseVariableBlock({ block }) {
  const [selectedVariable, setSelectedVariable] = useState(block.variable || '');
  const isUnconnected = !block.parentId && !block.childId;
  
  const style = {
    padding: '8px 12px',
    backgroundColor: block.color || '#27AE60',
    color: 'white', 
    width: '220px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    opacity: isUnconnected ? 0.6 : 1,
    gap: '4px'
  };

  return (
    <div style={style}>
      <div style={{ fontWeight: 'bold' }}>{block.label}</div>
      <input
        type="text"
        placeholder="Variable name"
        value={selectedVariable}
        onChange={(e) => setSelectedVariable(e.target.value)}
        style={{
          width: '100%',
          padding: '4px',
          fontSize: '12px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
      />
    </div>
  );
}

export default UseVariableBlock;
