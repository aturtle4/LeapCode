import React from 'react';
import { useDraggable } from '@dnd-kit/core';

function DroppedBlock({ id, label, x = 0, y = 0 }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  // Apply position based on x and y values
  const style = {
    position: 'absolute', // Use absolute positioning to allow free placement
    top: `${y}px`,
    left: `${x}px`,
    padding: '12px 20px',
    margin: '8px 0',
    backgroundColor: '#4CAF50',
    borderRadius: '8px',
    border: '1px solid #388E3C',
    cursor: 'move',
    boxShadow: isDragging ? '0 4px 8px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: 'box-shadow 0.2s, transform 0.2s',
    opacity: isDragging ? 0.7 : 1,
    userSelect: 'none',
    zIndex: isDragging ? 1000 : 'auto',
    fontSize: '14px',
    fontWeight: '500',
    minWidth: '120px',
    textAlign: 'left',
    color: '#fff',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      {label}
      <div
        style={{
          width: '10px',
          height: '100%',
          backgroundColor: '#388E3C',
          borderRadius: '0 8px 8px 0',
          cursor: 'move',
        }}
      />
    </div>
  );
}

export default DroppedBlock;
