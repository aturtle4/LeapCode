import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import SetVarBlock from './SetVarBlock';
import IfBlock from './IfBlock';
import ForLoopBlock from './ForLoopBlock';
import AddBlock from './AddBlock';
import DraggableBlock from '../PracticeProblem/DraggableBlock';

const blockComponents = {
  setVariable: SetVarBlock,
  changeVariable: SetVarBlock,
  if: IfBlock,
  forLoop: ForLoopBlock,
  add: AddBlock,
};

function BlockFactory({ block, children, positioning = 'absolute', allBlocks }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
    data: { ...block, from: 'rightArea' },
  });
  console.log(block)
  const BlockComponent = blockComponents[block.type] || DraggableBlock;

  const style = {
    ...(positioning === 'absolute'
      ? {
          position: 'absolute',
          left: transform ? block.x + transform.x : block.x,
          top: transform ? block.y + transform.y : block.y,
          zIndex: isDragging ? 100 : 1,
        }
      : {
          position: 'static',
        }),
    cursor: isDragging ? 'grabbing' : 'grab',
    transform: isDragging ? 'scale(1.05)' : 'none',
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <BlockComponent block={block} allBlocks={allBlocks}>{children}</BlockComponent>
    </div>
  );
}

export default BlockFactory;
