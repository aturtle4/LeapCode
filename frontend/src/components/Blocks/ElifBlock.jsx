import React, { useState, useEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import BlockFactory from './BlockFactory';

function ElifBlock({ block, allBlocks }) {
  const [condition, setCondition] = useState(block.condition || '');
  const [nestedBlocks, setNestedBlocks] = useState(block.nestedBlocks || []);
  const nestingRef = useRef(null);
  const [nestingHeight, setNestingHeight] = useState(50); // Default height for nesting area
  const isUnconnected = !block.parentId && !block.childId;
  // Sync nestedBlocks with the block's nestedBlocks (now always objects)
  useEffect(() => {
    setNestedBlocks(block.nestedBlocks || []);
  }, [block.nestedBlocks]);

  // Adjust nesting area height based on nested blocks count
  useEffect(() => {
    const newHeight = nestedBlocks.length * 90; // 90px per nested block
    setNestingHeight(newHeight > 0 ? newHeight : 50); // Fallback to 50px if no content
  }, [nestedBlocks]);

  const { setNodeRef: droppableRef } = useDroppable({
    id: `nesting-${block.id}`, // Unique id for droppable area
  });

  const style = {
    width: '220px',
    backgroundColor: block.color || '#E74C3C',
    color: 'white',
    borderRadius: '8px',
    opacity: isUnconnected ? 0.6 : 1,
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
    height: `${nestingHeight}px`, // Dynamic height based on nested blocks
    padding: '8px',
    margin: '0 12px',
    position: 'relative',
    borderLeft: '2px dashed rgba(255, 255, 255, 0.3)',
    borderRight: '2px dashed rgba(255, 255, 255, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px', // Space between nested blocks
    overflow: 'auto', // Ensure overflow is visible
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
      <div
        ref={(node) => {
          droppableRef(node);
          nestingRef.current = node;
        }}
        style={nestingAreaStyle}
      >
        {nestedBlocks.length > 0 ? (
          nestedBlocks.map((child) => (
            <BlockFactory key={child.id} block={child} positioning="static" allBlocks={allBlocks} />
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

export default ElifBlock;