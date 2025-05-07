import React, { useState, useEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import BlockFactory from './BlockFactory';

function NestableArea({ block, allBlocks, nestedBlocks, blockColor }) {
  const [isValidDropTarget, setIsValidDropTarget] = useState(true);
  const nestingRef = useRef(null);
  const [nestingHeight, setNestingHeight] = useState(50); // Default height for nesting area

  // Adjust nesting area height based on nested blocks count
  useEffect(() => {
    if (!nestedBlocks) return;
    const newHeight = nestedBlocks.length * 90; // 90px per nested block
    setNestingHeight(newHeight > 0 ? newHeight : 50); // Fallback to 50px if no content
  }, [nestedBlocks]);

  const { setNodeRef: droppableRef, isOver, active } = useDroppable({
    id: `nesting-${block.id}`, // Unique id for droppable area
  });

  // Check if the currently dragged block is valid for nesting
  useEffect(() => {
    if (isOver && active) {
      // Check if trying to nest a block inside itself
      const isSelfNesting = active.id === block.id;
      
      // Check if trying to nest a parent into its child (only if from workspace)
      const isParentNesting = active.data.current?.from !== 'toolkit' && 
        active.data.current?.nestedBlocks?.some(nestedBlock => 
          nestedBlock.id === block.id || 
          (nestedBlock.nestedBlocks && nestedBlock.nestedBlocks.some(nb => nb.id === block.id))
        );
      
      setIsValidDropTarget(!isSelfNesting && !isParentNesting);
    } else {
      setIsValidDropTarget(true);
    }
  }, [isOver, active, block.id]);

  const nestingAreaStyle = {
    backgroundColor: isValidDropTarget 
      ? 'rgba(0, 0, 0, 0.15)' 
      : 'rgba(204, 0, 0, 0.15)', // Red background when invalid
    height: `${nestingHeight}px`, // Dynamic height based on nested blocks
    padding: '8px',
    margin: '0 12px',
    position: 'relative',
    borderLeft: `2px dashed ${isValidDropTarget ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 0, 0, 0.5)'}`,
    borderRight: `2px dashed ${isValidDropTarget ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 0, 0, 0.5)'}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px', // Space between nested blocks
    overflow: 'auto', // Ensure overflow is visible
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  };

  const tooltipStyle = {
    position: 'absolute',
    top: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(204, 0, 0, 0.9)',
    color: 'white',
    padding: '6px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    zIndex: 100,
    opacity: isOver && !isValidDropTarget ? 1 : 0,
    transition: 'opacity 0.2s ease',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  };

  const tooltipArrowStyle = {
    position: 'absolute',
    bottom: '-5px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid rgba(204, 0, 0, 0.9)',
  };

  return (
    <div
      ref={(node) => {
        droppableRef(node);
        nestingRef.current = node;
      }}
      style={nestingAreaStyle}
    >
      {/* Error tooltip for invalid nesting */}
      {isOver && !isValidDropTarget && (
        <div style={tooltipStyle}>
          Cannot nest a block inside itself or its parent
          <div style={tooltipArrowStyle}></div>
        </div>
      )}
      
      {nestedBlocks && nestedBlocks.length > 0 ? (
        nestedBlocks.map((child) => (
          <BlockFactory key={child.id} block={child} positioning="static" allBlocks={allBlocks} />
        ))
      ) : (
        <div style={{ 
          color: isValidDropTarget ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 0, 0, 0.7)', 
          fontSize: '12px', 
          textAlign: 'center' 
        }}>
          {isValidDropTarget ? 'Drop blocks here' : 'Cannot nest this block here'}
        </div>
      )}
    </div>
  );
}

export default NestableArea; 