import React from 'react';
import { Box } from '@mui/material';
import { DragOverlay } from '@dnd-kit/core';
import BlockFactory from '../Blocks/BlockFactory';

const DragOverlayComponent = ({ activeBlock, allBlocks }) => {
  if (!activeBlock) return null;

  // If activeBlock is from toolkit, render simple overlay
  if (activeBlock.from === 'toolkit') {
    const tabStyles = [
      { activeColor: '#27AE60' }, // Variables
      { activeColor: '#3498DB' }, // Flow
      { activeColor: '#E74C3C' }, // Conditional Statements
      { activeColor: '#F1C40F' }, // Maths
      { activeColor: '#9B59B6' }, // Functions
    ];

    const typeToColorMap = {
      setVariable: tabStyles[0].activeColor,
      changeVariable: tabStyles[0].activeColor,
      useVariable: tabStyles[0].activeColor,
      start: tabStyles[1].activeColor,
      end: tabStyles[1].activeColor,
      forLoop: tabStyles[1].activeColor,
      whileLoop: tabStyles[1].activeColor,
      if: tabStyles[2].activeColor,
      elif: tabStyles[2].activeColor,
      else: tabStyles[2].activeColor,
      add: tabStyles[3].activeColor,
      subtract: tabStyles[3].activeColor,
      multiply: tabStyles[3].activeColor,
      divide: tabStyles[3].activeColor,
      createFunc: tabStyles[4].activeColor,
      callFunc: tabStyles[4].activeColor,
    };

    return (
      <DragOverlay zIndex={1000}>
        <Box
          sx={{
            padding: '12px 20px',
            backgroundColor: typeToColorMap[activeBlock.type],
            color: 'white',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '14px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transform: 'scale(1.05)',
          }}
        >
          {activeBlock.label}
        </Box>
      </DragOverlay>
    );
  }

  // Find the full block data from allBlocks
  const fullBlock = allBlocks.find(block => block.id === activeBlock.id);

  // If block not found in allBlocks, create a default block based on type
  if (!fullBlock) {
    const tabStyles = [
      { activeColor: '#27AE60' }, // Variables
      { activeColor: '#3498DB' }, // Flow
      { activeColor: '#E74C3C' }, // Conditional Statements
      { activeColor: '#F1C40F' }, // Maths
      { activeColor: '#9B59B6' }, // Functions
    ];
    console.log(fullBlock)

    const getColorForType = (type) => {
      return '#9B59B6';
    };

    return (
      <DragOverlay zIndex={1000}>
        <Box
          sx={{
            padding: '12px 20px',
            backgroundColor: getColorForType(activeBlock.type),
            color: 'white',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '14px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transform: 'scale(1.05)',
          }}
        >
          {activeBlock.label || activeBlock.type}
        </Box>
      </DragOverlay>
    );
  }

  // If from workspace, render full block
  return (
    <DragOverlay zIndex={1000}>
      {fullBlock && (
        <BlockFactory 
          block={fullBlock}
          positioning="static"
          allBlocks={allBlocks}
        />
      )}
    </DragOverlay>
  );
};

export default DragOverlayComponent;