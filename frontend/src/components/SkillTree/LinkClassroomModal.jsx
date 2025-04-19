import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  IconButton,
  CircularProgress,
  Divider,
  Box,
  Alert,
} from "@mui/material";
import { Link, School, CheckCircle } from "@mui/icons-material";
import { googleClassroomAPI } from "../../services/googleClassroomAPI";

const LinkClassroomModal = ({
  open,
  onClose,
  skillTreeId,
  darkMode,
  onSuccess,
}) => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [linking, setLinking] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [linkSuccess, setLinkSuccess] = useState(false);

  // Fetch classrooms when modal opens
  useEffect(() => {
    if (open) {
      fetchClassrooms();
    }
  }, [open]);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await googleClassroomAPI.getClassrooms();
      setClassrooms(data);
    } catch (err) {
      console.error("Failed to fetch classrooms:", err);
      setError("Failed to load classrooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClassroom = (classroom) => {
    setSelectedClassroom(classroom);
  };

  const handleLinkClassroom = async () => {
    if (!selectedClassroom) return;

    try {
      setLinking(true);
      setError(null);
      await googleClassroomAPI.linkSkillTreeToClassroom(
        skillTreeId,
        selectedClassroom.id
      );
      setLinkSuccess(true);
      if (onSuccess) {
        onSuccess(selectedClassroom);
      }
    } catch (err) {
      console.error("Failed to link classroom:", err);
      setError("Failed to link classroom. Please try again.");
    } finally {
      setLinking(false);
    }
  };

  const handleClose = () => {
    // Reset state
    setSelectedClassroom(null);
    setLinkSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          backgroundColor: darkMode ? "#353535" : "#ffffff",
          color: darkMode ? "#d7d7d6" : "#403f3f",
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <School sx={{ mr: 1 }} />
          Link to Google Classroom
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {linkSuccess ? (
          <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
            Successfully linked to classroom: {selectedClassroom?.name}
          </Alert>
        ) : (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Select a Google Classroom to link with this skill tree. Students
              will be able to access classroom resources directly from the skill
              tree.
            </Typography>

            {loading ? (
              <Box display="flex" justifyContent="center" my={3}>
                <CircularProgress />
              </Box>
            ) : classrooms.length > 0 ? (
              <List>
                {classrooms.map((classroom) => (
                  <React.Fragment key={classroom.id}>
                    <ListItem
                      button
                      selected={selectedClassroom?.id === classroom.id}
                      onClick={() => handleSelectClassroom(classroom)}
                      sx={{
                        borderRadius: "8px",
                        mb: 1,
                        bgcolor:
                          selectedClassroom?.id === classroom.id
                            ? darkMode
                              ? "#4a4a4a"
                              : "#e3f2fd"
                            : "transparent",
                        "&:hover": {
                          bgcolor: darkMode ? "#4a4a4a" : "#e3f2fd",
                        },
                      }}
                    >
                      <ListItemText
                        primary={classroom.name}
                        secondary={
                          classroom.description || "No description available"
                        }
                        primaryTypographyProps={{
                          fontWeight:
                            selectedClassroom?.id === classroom.id
                              ? "bold"
                              : "normal",
                        }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleSelectClassroom(classroom)}
                          sx={{ color: darkMode ? "#90caf9" : "#1976d2" }}
                        >
                          <Link />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No classrooms found. Make sure you have access to Google
                Classroom.
              </Typography>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          sx={{ color: darkMode ? "#90caf9" : "#1976d2" }}
        >
          {linkSuccess ? "Close" : "Cancel"}
        </Button>

        {!linkSuccess && (
          <Button
            variant="contained"
            onClick={handleLinkClassroom}
            disabled={!selectedClassroom || linking}
            startIcon={linking ? <CircularProgress size={20} /> : <School />}
            sx={{
              bgcolor: darkMode ? "#1976d2" : "#1976d2",
              "&:hover": {
                bgcolor: darkMode ? "#1565c0" : "#1565c0",
              },
            }}
          >
            {linking ? "Linking..." : "Link Classroom"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LinkClassroomModal;
