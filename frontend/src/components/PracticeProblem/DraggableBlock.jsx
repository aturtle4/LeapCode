import React from 'react';
import { useDraggable } from '@dnd-kit/core';

function DraggableBlock({ id, label }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  // Block styling inspired by Code.org's block style
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // To ensure text is on one side and the drag handle on the other
    padding: '10px 16px',
    margin: '8px 12px',
    backgroundColor: '#4CAF50', // A vibrant color (like Code.org blocks)
    borderRadius: '8px', // Rounded corners
    border: '2px solid #388E3C',
    cursor: 'move',
    boxShadow: isDragging ? '0 4px 8px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: 'box-shadow 0.2s, transform 0.2s',
    opacity: isDragging ? 0.7 : 1,
    userSelect: 'none',
    zIndex: isDragging ? 1000 : 'auto',
    fontSize: '14px',
    fontWeight: '500',
    maxWidth: '120px', // Ensure each block has a consistent width
    textAlign: 'left', // Align text to the left
    color: '#fff', // White text color for better contrast
    whiteSpace: 'nowrap', // Prevent text from breaking
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      <span>{label}</span>
      {/* Adding a drag handle on the right */}
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

export default DraggableBlock;

