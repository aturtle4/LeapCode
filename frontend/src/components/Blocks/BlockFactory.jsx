import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import SetVarBlock from './SetVarBlock';
import IfBlock from './IfBlock';
import ForLoopBlock from './ForLoopBlock';
import AddBlock from './AddBlock';
import DraggableBlock from '../PracticeProblem/DraggableBlock';
import WhileBlock from './WhileBlock';
import StartBlock from './StartBlock';
import EndBlock from './EndBlock';
import ChangeVariableBlock from './ChangeVariableBlock';
import ForBlock from './ForBlock';
import UseVariableBlock from './UseVariableBlock';
import SubtractBlock from './SubtractBlock';
import MultiplyBlock from './MultiplyBlock';
import DivideBlock from './DivideBlock';
import ElifBlock from './ElifBlock';
import ElseBlock from './ElseBlock';

const blockComponents = {
  setVariable: SetVarBlock,
  changeVariable: SetVarBlock,
  if: IfBlock,
  forLoop: ForLoopBlock,
  add: AddBlock,
  whileLoop: WhileBlock,
  start: StartBlock,
  end: EndBlock,
  changeVariable: ChangeVariableBlock,
  forLoop: ForBlock,
  useVariable: UseVariableBlock,
  subtract: SubtractBlock,
  multiply: MultiplyBlock,
  divide: DivideBlock,
  elif: ElifBlock,
  else: ElseBlock,
};

function BlockFactory({ block, children, positioning = 'absolute', allBlocks }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
    data: { ...block, from: 'rightArea' },
    modifiers: {
      threshold: {
        distance: 10,
      },
    },
  });
  
  const BlockComponent = blockComponents[block.type] || DraggableBlock;

  const handleClick = (e) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e) => {
    if (block.canNest) {
      setTimeout(() => {}, 100);
    }
  };

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
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={handleClick} onMouseDown={handleMouseDown}>
      <BlockComponent block={block} allBlocks={allBlocks}>{children}</BlockComponent>
    </div>
  );
}

export default BlockFactory;