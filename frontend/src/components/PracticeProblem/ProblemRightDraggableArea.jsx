import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import BlockFactory from '../Blocks/BlockFactory';

function ProblemRightDraggableArea({ droppedBlocks }) {
  const { setNodeRef } = useDroppable({
    id: 'droppable-area',
  });

  const renderBlock = (block) => (
    <BlockFactory key={block.id} block={block}>
      {block.children && block.children.length > 0 && (
        <div style={{ position: 'relative' }}>
          {block.children.map((child) => (
            <div
              key={child.id}
              style={{
                position: 'absolute',
                left: child.x,
                top: child.y,
              }}
            >
              {renderBlock(child)}
            </div>
          ))}
        </div>
      )}
    </BlockFactory>
  );

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        borderRadius: '10px',
        overflow: 'auto',
      }}
    >
      {droppedBlocks.length > 0 ? (
        droppedBlocks
          .filter((block) => !block.parentId)
          .map((block) => renderBlock(block))
      ) : (
        <p style={{ color: '#888', textAlign: 'center' }}>Drop blocks here</p>
      )}
    </div>
  );
}

export default ProblemRightDraggableArea;