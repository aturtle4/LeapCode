import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';

const ToolkitBlock = ({ id, label, category, type, canNest, color }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: {
      label,
      category,
      type,
      canNest,
      color,
      from: 'toolkit',
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: '10px 16px',
        backgroundColor: color || '#7B61FF',
        color: 'white',
        marginBottom: '12px',
        marginRight: '12px',
        height: 'fit-content',
        borderRadius: '8px',
        cursor: 'grab',
        fontWeight: 500,
        width: 'fit-content',
      }}
    >
      {label}
    </div>
  );
};

function ProblemToolKit() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabStyles = [
    { activeColor: '#27AE60', inactiveColor: '#27AE60', hoverColor: '#2ECC71' },
    { activeColor: '#3498DB', inactiveColor: '#3498DB', hoverColor: '#5DADE2' },
    { activeColor: '#E74C3C', inactiveColor: '#E74C3C', hoverColor: '#EC7063' },
    { activeColor: '#F1C40F', inactiveColor: '#F1C40F', hoverColor: '#F4D03F' },
    { activeColor: '#9B59B6', inactiveColor: '#9B59B6', hoverColor: '#AF7AC5' },
  ];

  const blocks = {
    0: [
      { id: 'var1', label: 'Set Variable', category: 'variables', type: 'setVariable', canNest: false, color: '#27AE60' },
      { id: 'var2', label: 'Change Variable', category: 'variables', type: 'changeVariable', canNest: false, color: '#27AE60' },
      { id: 'var3', label: 'Use Variable', category: 'variables', type: 'useVariable', canNest: false, color: '#27AE60' },
      { id: 'var4', label: 'Set Variable Again', category: 'variables', type: 'setVariable', canNest: false, color: '#27AE60' },
    ],
    1: [
      { id: 'flow1', label: 'Start', category: 'flow', type: 'start', canNest: false, color: '#3498DB' },
      { id: 'flow2', label: 'End', category: 'flow', type: 'end', canNest: false, color: '#3498DB' },
      { id: 'flow3', label: 'For Loop', category: 'flow', type: 'forLoop', canNest: true, color: '#3498DB' },
      { id: 'flow4', label: 'While Loop', category: 'flow', type: 'whileLoop', canNest: true, color: '#3498DB' },
    ],
    2: [
      { id: 'cond1', label: 'If', category: 'conditionals', type: 'if', canNest: true, color: '#E74C3C' },
      { id: 'cond2', label: 'Elif', category: 'conditionals', type: 'elif', canNest: true, color: '#E74C3C' },
      { id: 'cond3', label: 'Else', category: 'conditionals', type: 'else', canNest: true, color: '#E74C3C' },
    ],
    3: [
      { id: 'math1', label: 'Add', category: 'math', type: 'add', canNest: false, color: '#F1C40F' },
      { id: 'math2', label: 'Subtract', category: 'math', type: 'subtract', canNest: false, color: '#F1C40F' },
      { id: 'math3', label: 'Multiply', category: 'math', type: 'multiply', canNest: false, color: '#F1C40F' },
      { id: 'math4', label: 'Divide', category: 'math', type: 'divide', canNest: false, color: '#F1C40F' },
    ],
    4: [
      { id: 'func1', label: 'Create Function', category: 'functions', type: 'createFunction', canNest: true, color: '#9B59B6' },
      { id: 'func2', label: 'Call Function', category: 'functions', type: 'callFunction', canNest: false, color: '#9B59B6' },
    ],
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="inherit"
        TabIndicatorProps={{ style: { display: 'none' } }}
        sx={{ minHeight: '40px', mb: 1 }}
      >
        {['Variables', 'Flow', 'Conditional Statements', 'Maths', 'Functions'].map((label, index) => (
          <Tab
            key={label}
            label={label}
            sx={{
              fontWeight: 500,
              color: activeTab === index
                ? tabStyles[index].activeColor
                : tabStyles[index].inactiveColor + '80',

              backgroundColor: activeTab === index
                ? tabStyles[index].activeColor + '20'
                : 'transparent',
              '&:hover': { backgroundColor: tabStyles[index].hoverColor + '20' },
              borderRadius: index === 0
                ? '8px 0 0 0'
                : index === 4
                ? '0 8px 0 0'
                : undefined,
              minHeight: '40px',
              textTransform: 'none',
            }}
          />
        ))}
      </Tabs>

      <Box sx={{
        flexGrow: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
      }}>
        {blocks[activeTab].map((block) => (
          <ToolkitBlock
            key={block.id}
            id={block.id}
            label={block.label}
            category={block.category}
            type={block.type}
            canNest={block.canNest}
            color={block.color}
          />
        ))}
      </Box>
    </Box>
  );
}

export default ProblemToolKit;