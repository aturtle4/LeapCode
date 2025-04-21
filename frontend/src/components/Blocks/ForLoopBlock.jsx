import React, { useState } from 'react';

function ForLoopBlock({ block, children }) {
  const [iterations, setIterations] = useState(block.iterations || '');

  // Approximate height based on children
  const childCount = block.children ? block.children.length : 0;
  const minHeight = 50;
  const childHeight = childCount * 40;
  const nestingAreaHeight = Math.max(minHeight, childHeight);

  const style = {
    width: '220px',
    backgroundColor: block.color || '#3498DB',
    color: 'white',
    borderRadius: '8px',
    padding: '0',
  };

  const topSectionStyle = {
    padding: '8px 12px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const nestingAreaStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    minHeight: `${nestingAreaHeight}px`,
    padding: '8px',
    margin: '0 12px',
    position: 'relative',
  };

  const bottomSectionStyle = {
    padding: '4px 12px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    height: '12px',
  };

  return (
    <div style={style}>
      <div style={topSectionStyle}>
        <div style={{ fontWeight: 'bold' }}>{block.label}</div>
        <input
          type="text"
          placeholder="Iterations (e.g., 5)"
          value={iterations}
          onChange={(e) => setIterations(e.target.value)}
          style={{
            width: '100%',
            padding: '4px',
            fontSize: '12px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        />
      </div>
      <div style={nestingAreaStyle}>
        {children || (
          <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', textAlign: 'center' }}>
            Drop blocks here
          </div>
        )}
      </div>
      <div style={bottomSectionStyle} />
    </div>
  );
}

export default ForLoopBlock;