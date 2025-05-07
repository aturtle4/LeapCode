import React, { useState, useEffect } from 'react';
import NestableArea from './NestableArea';

function ElifBlock({ block, allBlocks }) {
  const [condition, setCondition] = useState(block.condition || '');
  const [nestedBlocks, setNestedBlocks] = useState(block.nestedBlocks || []);

  // Sync nestedBlocks with the block's nestedBlocks (now always objects)
  useEffect(() => {
    setNestedBlocks(block.nestedBlocks || []);
  }, [block.nestedBlocks]);

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

  const bottomSectionStyle = {
    padding: '4px 12px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    height: '12px',
  };

  return (
    <div style={style}>
      <div 
        style={topSectionStyle} 
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={{ fontWeight: 'bold' }}>{block.label}</div>
        <input
          type="text"
          placeholder="Condition (e.g., x > 0)"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
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
      
      <NestableArea 
        block={block} 
        allBlocks={allBlocks} 
        nestedBlocks={nestedBlocks} 
        blockColor={block.color || '#3498DB'} 
      />
      
      <div style={bottomSectionStyle} />
    </div>
  );
}

export default ElifBlock;