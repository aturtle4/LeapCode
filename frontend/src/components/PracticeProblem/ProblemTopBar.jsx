import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function ProblemTopBar({ darkMode }) {
  return (
    <AppBar position="static" elevation={3} sx={{ bgcolor: darkMode ? '#353535' : '#ffffff', px: 3 }}>
      <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 60 }}>
        
        {/* Left Side: Title */}
        <Typography variant="h6" sx={{ color: darkMode ? '#d7d7d6' : '#403f3f', fontWeight: 500 }}>
          Problem List {`>`} Sum of Two Numbers
        </Typography>

        {/* Right Side: Run/Submit/Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PlayArrowIcon />}
            sx={{
              color: darkMode ? '#d7d7d6' : '#403f3f',
              borderColor: '#888',
              '&:hover': { borderColor: '#7B61FF', backgroundColor: '#2c2c2c' }
            }}
          >
            Run
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckCircleIcon />}
            sx={{
              backgroundColor: '#7B61FF',
              color: 'white',
              '&:hover': { backgroundColor: '#9e82ff' }
            }}
          >
            Submit
          </Button>
          <IconButton sx={{ ml: 1 }}>
            <AccountCircleIcon sx={{ color: '#aaa' }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ProblemTopBar;