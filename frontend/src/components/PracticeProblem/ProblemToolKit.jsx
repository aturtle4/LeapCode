import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import DraggableBlock from '../../components/PracticeProblem/DraggableBlock'; 

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
      { id: 'var1', label: 'Set Variable' },
      { id: 'var2', label: 'Change Variable' },
    ],
    1: [ // Flow
      { id: 'flow1', label: 'Loop' },
      { id: 'flow2', label: 'Wait' },
    ],
    2: [ // Conditional Statements
      { id: 'cond1', label: 'If Condition' },
      { id: 'cond2', label: 'If-Else' },
    ],
    3: [ // Maths
      { id: 'math1', label: 'Add' },
      { id: 'math2', label: 'Multiply' },
    ],
    4: [ // Functions
      { id: 'func1', label: 'Define Function' },
      { id: 'func2', label: 'Call Function' },
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

      <Box sx={{ flexGrow: 1, p: 2, overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {blocks[activeTab].map((block) => (
          <DraggableBlock key={block.id} id={block.id} label={block.label} />
        ))}
      </Box>
    </Box>
  );
}

export default ProblemToolKit;
