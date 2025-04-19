import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import DroppedBlock from '../../components/PracticeProblem/DroppedBlock';

function ProblemRightDraggableArea({ droppedBlocks, setDroppedBlocks }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'droppable-area' });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id === 'droppable-area') {
      const newBlock = {
        id: `${active.id}-${Date.now()}`,
        label: active.data?.current?.label || active.id,
        x: event.delta.x, // Store the position on the X axis
        y: event.delta.y, // Store the position on the Y axis
      };
      setDroppedBlocks((prev) => [...prev, newBlock]);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        backgroundColor: isOver ? '#e8f8f5' : '#fafafa',
        transition: 'background-color 0.3s',
        overflowY: 'auto',
        overflowX: 'auto',
        position: 'relative',
      }}
    >
      {droppedBlocks.length === 0 ? (
        <p style={{ color: '#aaa', margin: 0 }}>Drag blocks here</p>
      ) : (
        droppedBlocks.map((block) => (
          <DroppedBlock
            key={block.id}
            id={block.id}
            label={block.label}
            x={block.x} // Pass position to DroppedBlock
            y={block.y} // Pass position to DroppedBlock
          />
        ))
      )}
    </div>
  );
}

export default ProblemRightDraggableArea;
