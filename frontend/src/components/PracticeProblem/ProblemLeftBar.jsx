import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';

function ProblemLeftBar({ darkMode }) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        width: 320,
        height: '100vh',
        bgcolor: darkMode ? '#353535' : '#ffffff',
        color: darkMode ? '#d7d7d6' : '#403f3f',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '2px solid #7B61FF',
        borderRadius: '0 8px 8px 0',
        overflow: 'hidden',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="inherit"
        TabIndicatorProps={{ style: { background: '#7B61FF' } }}
        sx={{ borderBottom: '1px solid #333' }}
      >
        <Tab label="Description" />
        <Tab label="Submissions" />
      </Tabs>

      <Box p={2} sx={{ flex: 1, overflowY: 'auto' }}>
        {tabIndex === 0 && (
          <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>
            <strong>Problem:</strong> Sum of Two Numbers{'\n\n'}
            Write a function that returns the sum of two integers.
            {'\n\n'}
            Example:{'\n'}Input: 3, 5{'\n'}Output: 8
          </Typography>
        )}
        {tabIndex === 1 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Past Submissions</Typography>
            <Box
              sx={{
                backgroundColor: '#2b2b2b',
                borderRadius: '6px',
                p: 1,
                mb: 1,
              }}
            >
              <Typography fontSize={13}>✅ Passed • 2025-04-19 • 34ms</Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: '#2b2b2b',
                borderRadius: '6px',
                p: 1,
              }}
            >
              <Typography fontSize={13}>❌ Failed • 2025-04-19 • Test Case 2 Failed</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default ProblemLeftBar;