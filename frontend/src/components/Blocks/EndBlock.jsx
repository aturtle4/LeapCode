import React from 'react';

function EndBlock({ block }) {
    const isUnconnected = !block.parentId && !block.childId;    
    const style = {
        padding: '35px 12px',
        backgroundColor: block.color || '#3498DB',
        color: 'white',
        width: '150px',
        borderRadius: '5px 5px 10px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        opacity: isUnconnected ? 0.6 : 1,
    };

  return (
    <div style={style}>
      <div style={{ fontWeight: 'bold' }}>{block.label || 'End'}</div>
    </div>
  );
}

export default EndBlock;
