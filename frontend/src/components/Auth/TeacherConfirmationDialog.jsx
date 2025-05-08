import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';

const TeacherConfirmationDialog = ({ open, onClose, onConfirm, darkMode }) => {
  return (
    <Dialog 
      open={open} 
      onClose={() => onClose(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? "#403F3F" : "#f5f5f5",
          color: darkMode ? "#d7d7d6" : "#403f3f",
          borderRadius: '10px',
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" align="center" gutterBottom>
          Welcome to LeapCode!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            color: darkMode ? "#d7d7d6" : "#555555",
            textAlign: 'center',
            mb: 3,
          }}
        >
          Please select your account type to complete your registration:
        </DialogContentText>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          flexDirection: { xs: 'column', sm: 'row' } 
        }}>
          <Button
            variant="outlined"
            onClick={() => onClose(false)}
            sx={{ 
              py: 2, 
              px: 3,
              mb: { xs: 2, sm: 0 },
              borderColor: darkMode ? "#aaaaaa" : "#777777",
              color: darkMode ? "#d7d7d6" : "#555555",
              '&:hover': {
                borderColor: darkMode ? "#d7d7d6" : "#333333",
                backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              },
              display: 'flex',
              flexDirection: 'column',
              width: { xs: '100%', sm: '45%' }
            }}
          >
            <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle1">Student</Typography>
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              I'm here to learn and practice coding
            </Typography>
          </Button>

          <Button
            variant="outlined"
            onClick={() => onConfirm(true)}
            sx={{ 
              py: 2, 
              px: 3,
              borderColor: darkMode ? "#2196f3" : "#1976d2",
              color: darkMode ? "#2196f3" : "#1976d2",
              '&:hover': {
                borderColor: darkMode ? "#90caf9" : "#1565c0",
                backgroundColor: darkMode ? 'rgba(33,150,243,0.1)' : 'rgba(25,118,210,0.1)',
              },
              display: 'flex',
              flexDirection: 'column',
              width: { xs: '100%', sm: '45%' }
            }}
          >
            <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle1">Teacher</Typography>
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              I want to create and manage problems for students
            </Typography>
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Typography variant="caption" sx={{ color: darkMode ? "#aaaaaa" : "#777777" }}>
          You can change your role later from your profile settings
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default TeacherConfirmationDialog;