import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { backdropClasses } from '@mui/material';
import DraggableBlock from './DraggableBlock';


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
        overflow: 'auto',
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
        <p></p>
      )}
    </div>
  );
}

export default ProblemRightDraggableArea;