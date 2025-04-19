import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';

// Draggable Block Component
const ToolkitBlock = ({ id, label, category }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: {
      label,
      category, // Add category to data for better management
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
};

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
      { id: 'var1', label: 'Set Variable', category: 'variables' },
      { id: 'var2', label: 'Change Variable', category: 'variables' },
      { id: 'var3', label: 'Use Variable', category: 'variables' },
      { id: 'var4', label: 'Set Variable Again', category: 'variables' },
    ],
    1: [ // Flow
      { id: 'flow1', label: 'Start', category: 'flow' },
      { id: 'flow2', label: 'End', category: 'flow' },
      { id: 'flow3', label: 'For Loop', category: 'flow' },
      { id: 'flow4', label: 'While Loop', category: 'flow' },
    ],
    2: [ // Conditional Statements
      { id: 'cond1', label: 'If', category: 'conditionals' },
      { id: 'cond2', label: 'Elif', category: 'conditionals' },
      { id: 'cond3', label: 'Else', category: 'conditionals' },
    ],
    3: [ // Maths
      { id: 'math1', label: 'Add', category: 'math' },
      { id: 'math2', label: 'Subtract', category: 'math' },
      { id: 'math3', label: 'Multiply', category: 'math' },
      { id: 'math4', label: 'Divide', category: 'math' },
    ],
    4: [ // Functions
      { id: 'func1', label: 'Create Function', category: 'functions' },
      { id: 'func2', label: 'Call Function', category: 'functions' },
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
          <ToolkitBlock key={block.id} id={block.id} label={block.label} category={block.category} />
        ))}
      </Box>
    </Box>
  );
}

export default ProblemToolKit;
