import React from 'react';
import { useDraggable } from '@dnd-kit/core';

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
      from: block.category, // Mark it as coming from the specific category
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
    boxShadow: isDragging ? '0 4px 10px rgba(0,0,0,0.2)' : undefined,
    zIndex: isDragging ? 999 : 1,
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

export default DraggableBlock;