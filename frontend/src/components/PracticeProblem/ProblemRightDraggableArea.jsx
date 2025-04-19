import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';

function DraggableBlock({ block, onPositionChange }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: block.id,
    data: {
      ...block,
      from: 'rightArea', // Mark it as coming from the right area
    },
  });

  const style = {
    position: 'absolute',
    left: transform ? block.x + transform.x : block.x,
    top: transform ? block.y + transform.y : block.y,
    padding: '8px',
    backgroundColor: isDragging ? '#66bb6a' : '#4CAF50',
    color: 'white',
    maxWidth: '120px',
    width: '100%',
    borderRadius: '5px',
    cursor: 'grab',
    transition: isDragging ? 'none' : 'transform 0.2s ease',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {block.label}
    </div>
  );
}

function ProblemRightDraggableArea({ droppedBlocks }) {
  const { setNodeRef } = useDroppable({
    id: 'droppable-area',
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative', // Required for absolute children
        height: '100%',
        width: '100%',
        borderRadius: '10px',
        backgroundColor: '#f7f7f7',
        padding: '16px',
        overflow: 'hidden',
      }}
    >
      {droppedBlocks.length > 0 ? (
        droppedBlocks.map((block) => (
          <DraggableBlock
            key={block.id}
            block={block}
          />
        ))
      ) : (
        <p>Drop blocks here!</p>
      )}
    </div>
  );
}

export default ProblemRightDraggableArea;
