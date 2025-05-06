import React, { useState, memo } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';

// Draggable Block Component
const ToolkitBlock = React.memo(({ id, label, category, type, canNest }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: {
      label,
      category, // Add category to data for better management
      type,
      canNest,
      from: 'toolkit', // Mark that it comes from the toolkit
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: '10px 16px',
        backgroundColor: '#7B61FF',
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
});

function ProblemToolKit() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabStyles = [
    { activeColor: '#27AE60', inactiveColor: '#27AE60', hoverColor: '#2ECC71' }, // Variables
    { activeColor: '#3498DB', inactiveColor: '#3498DB', hoverColor: '#5DADE2' }, // Flow
    { activeColor: '#E74C3C', inactiveColor: '#E74C3C', hoverColor: '#EC7063' }, // Conditional Statements
    { activeColor: '#F1C40F', inactiveColor: '#F1C40F', hoverColor: '#F4D03F' }, // Maths
    { activeColor: '#9B59B6', inactiveColor: '#9B59B6', hoverColor: '#AF7AC5' }, // Functions
  ];

  const blocks = {
    0: [ // Variables
      { id: 'var1', label: 'Set Variable', type:'setVariable', category: 'variables', canNest: false },
      { id: 'var2', label: 'Change Variable', type:'changeVariable',category: 'variables', canNest: false},
      { id: 'var3', label: 'Use Variable', type:'useVariable',category: 'variables', canNest: false },
    ],
    1: [ // Flow
      { id: 'flow1', label: 'Start', type:'start',category: 'flow',canNest: false },
      { id: 'flow2', label: 'End', type:'end',category: 'flow',canNest: false },
      { id: 'flow3', label: 'For Loop', type:'forLoop',category: 'flow',canNest: true },
      { id: 'flow4', label: 'While Loop', type:'whileLoop',category: 'flow',canNest: true },
    ],
    2: [ // Conditional Statements
      { id: 'cond1', label: 'If', type:'if',category: 'conditionals',canNest: true },
      { id: 'cond2', label: 'Elif', type:'elif',category: 'conditionals',canNest: true },
      { id: 'cond3', label: 'Else', type:'else',category: 'conditionals',canNest: true },
    ],
    3: [ // Maths
      { id: 'math1', label: 'Add', type:'add',category: 'math',canNest: false },
      { id: 'math2', label: 'Subtract', type:'subtract',category: 'math',canNest: false },
      { id: 'math3', label: 'Multiply', type:'multiply',category: 'math',canNest: false },
      { id: 'math4', label: 'Divide', type:'divide',category: 'math',canNest: false },
    ],
    4: [ // Functions
      { id: 'func1', label: 'Create Function', type:'createFunc',category: 'functions', canNest: true},
      { id: 'func2', label: 'Call Function', type:'callFunc',category: 'functions', canNest: false },
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
                : (tabStyles[index].inactiveColor + '80'),
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
          flexDirection: 'row', // Change the direction to row for horizontal layout
          overflowX: 'auto', // Horizontal scrolling
          whiteSpace: 'nowrap', 
        }}>
        {blocks[activeTab].map((block) => (
          <ToolkitBlock key={block.id} id={block.id} label={block.label} category={block.category} type={block.type} canNest={block.canNest}/>
        ))}
      </Box>
    </Box>
  );
}

export default ProblemToolKit;