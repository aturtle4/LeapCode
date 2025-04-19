import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Add, Close, Save, ColorLens } from "@mui/icons-material";
import { skillTreeAPI } from "../../services/skillTreeAPI";

// List of preset colors for skill trees
const colorOptions = [
  "#e74c3c", // red
  "#f39c12", // orange
  "#3498db", // blue
  "#2ecc71", // green
  "#9b59b6", // purple
  "#1abc9c", // teal
  "#34495e", // dark blue
  "#e67e22", // dark orange
];

const SkillTreeForm = ({
  open,
  onClose,
  darkMode,
  onSuccess,
  editData = null,
}) => {
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    guide: editData?.guide || "",
    bg_color: editData?.bg_color || colorOptions[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const selectColor = (color) => {
    setFormData({
      ...formData,
      bg_color: color,
    });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result;
      if (isEditMode) {
        result = await skillTreeAPI.updateSkillTree(editData.id, formData);
      } else {
        result = await skillTreeAPI.createSkillTree(formData);
      }

      setSnackbar({
        open: true,
        message: isEditMode
          ? "Skill tree updated successfully!"
          : "New skill tree created!",
        severity: "success",
      });

      if (onSuccess) {
        onSuccess(result);
      }

      // Reset form and close dialog after successful operation
      if (!isEditMode) {
        setFormData({
          title: "",
          description: "",
          guide: "",
          bg_color: colorOptions[0],
        });
      }

      // Close after a short delay so user can see success message
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Error saving skill tree:", err);
      setError(err.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? null : onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            backgroundColor: darkMode ? "#353535" : "#ffffff",
            color: darkMode ? "#d7d7d6" : "#403f3f",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center">
            {isEditMode ? "Edit Skill Tree" : "Create New Skill Tree"}
          </Box>
          <IconButton
            onClick={onClose}
            disabled={loading}
            sx={{ color: darkMode ? "#d7d7d6" : "#403f3f" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              margin="normal"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "#6c6c6c" : undefined,
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#909090" : undefined,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#b3b3b3" : undefined,
                },
                "& .MuiInputBase-input": {
                  color: darkMode ? "#d7d7d6" : undefined,
                },
              }}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "#6c6c6c" : undefined,
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#909090" : undefined,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#b3b3b3" : undefined,
                },
                "& .MuiInputBase-input": {
                  color: darkMode ? "#d7d7d6" : undefined,
                },
              }}
            />

            <TextField
              fullWidth
              label="Guide/Instructor (Optional)"
              name="guide"
              value={formData.guide}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "#6c6c6c" : undefined,
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#909090" : undefined,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#b3b3b3" : undefined,
                },
                "& .MuiInputBase-input": {
                  color: darkMode ? "#d7d7d6" : undefined,
                },
              }}
            />

            <Box sx={{ mt: 3 }}>
              <InputLabel
                sx={{ color: darkMode ? "#b3b3b3" : undefined, mb: 1 }}
              >
                Background Color
              </InputLabel>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "space-between",
                }}
              >
                {colorOptions.map((color) => (
                  <Box
                    key={color}
                    onClick={() => selectColor(color)}
                    sx={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: color,
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      border:
                        formData.bg_color === color
                          ? "3px solid white"
                          : "none",
                      boxShadow:
                        formData.bg_color === color
                          ? "0 0 0 2px rgba(0,0,0,0.3)"
                          : "none",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{ color: darkMode ? "#90caf9" : "#1976d2" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} />
              ) : isEditMode ? (
                <Save />
              ) : (
                <Add />
              )
            }
            sx={{
              bgcolor: formData.bg_color,
              "&:hover": {
                bgcolor: formData.bg_color,
                filter: "brightness(0.85)",
              },
            }}
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Skill Tree"
              : "Create Skill Tree"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SkillTreeForm;
