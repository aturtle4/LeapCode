import React, { useState, useEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import BlockFactory from './BlockFactory';

function IfBlock({ block, children }) {
  const [condition, setCondition] = useState(block.condition || '');
  const [nestedBlocks, setNestedBlocks] = useState(block.children || []);
  const nestingRef = useRef(null);
  const [nestingHeight, setNestingHeight] = useState(50); // Default height

  // Sync nestedBlocks with block.children prop
  useEffect(() => {
    setNestedBlocks(block.children || []);
  }, [block.children]);

  // Update nesting height based on content
  useEffect(() => {
    if (nestingRef.current) {
      const height = nestingRef.current.scrollHeight;
      setNestingHeight(height > 0 ? height : 50); // Fallback to 50px if no content
    }
  }, [nestedBlocks]);

  const { setNodeRef: droppableRef } = useDroppable({
    id: `nesting-${block.id}`,
  });

  const style = {
    width: '220px',
    backgroundColor: block.color || '#E74C3C',
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
    height: `${nestingHeight}px`,
    padding: '8px',
    margin: '0 12px',
    position: 'relative',
    borderLeft: '2px dashed rgba(255, 255, 255, 0.3)',
    borderRight: '2px dashed rgba(255, 255, 255, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px', // Space between stacked blocks
    overflow: 'hidden', // Prevent overflow outside the area
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
          placeholder="Condition (e.g., x > 0)"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
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
      <div ref={(node) => {
        droppableRef(node);
        nestingRef.current = node;
      }} style={nestingAreaStyle}>
        {nestedBlocks.length > 0 ? (
          nestedBlocks.map((child) => (
            <BlockFactory key={child.id} block={child} positioning="static"/>
          ))
        ) : (
          <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', textAlign: 'center' }}>
            Drop blocks here
          </div>
        )}
      </div>
      <div style={bottomSectionStyle} />
    </div>
  );
}

export default IfBlock;