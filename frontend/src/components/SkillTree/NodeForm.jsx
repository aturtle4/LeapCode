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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
} from "@mui/material";
import { Add, Delete, Save } from "@mui/icons-material";
import { skillTreeAPI } from "../../services/skillTreeAPI";

// Node step types
const STEP_TYPES = [
  { value: "text", label: "Text Content" },
  { value: "video", label: "Video (YouTube/Vimeo)" },
  { value: "problem", label: "Practice Problem" },
];

const NodeForm = ({
  open,
  onClose,
  darkMode,
  skillTreeId,
  onSuccess,
  editData = null,
  nodeIndex = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditMode = !!editData;

  // Form data state with one initial step
  const [formData, setFormData] = useState({
    title: "",
    steps: [
      {
        title: "",
        type: "text",
        content: "",
      },
    ],
  });

  // Reset form when dialog opens or closes, or when editData changes
  React.useEffect(() => {
    if (open) {
      if (editData) {
        // If editing an existing node, initialize with its data
        setFormData({
          title: editData.title || "",
          steps:
            editData.steps && editData.steps.length > 0
              ? editData.steps.map((step) => ({
                  title: step.title || "",
                  type: step.type || "text",
                  content: step.content || "",
                  id: step.id, // Preserve the original ID if it exists
                }))
              : [
                  {
                    title: "",
                    type: "text",
                    content: "",
                  },
                ],
        });
      } else {
        // If adding a new node, reset to empty form
        setFormData({
          title: "",
          steps: [
            {
              title: "",
              type: "text",
              content: "",
            },
          ],
        });
      }
      setError(null);
    }
  }, [open, editData]);

  const handleTitleChange = (e) => {
    setFormData({
      ...formData,
      title: e.target.value,
    });
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      steps: updatedSteps,
    });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        {
          title: "",
          type: "text",
          content: "",
        },
      ],
    });
  };

  const removeStep = (index) => {
    if (formData.steps.length <= 1) {
      return; // Keep at least one step
    }
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      steps: updatedSteps,
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError("Node title is required");
      return;
    }

    // Validate each step has a title and content
    for (let i = 0; i < formData.steps.length; i++) {
      const step = formData.steps[i];
      if (!step.title.trim()) {
        setError(`Step ${i + 1} requires a title`);
        return;
      }
      if (!step.content.trim()) {
        setError(`Step ${i + 1} requires content`);
        return;
      }

      // Additional validation for video links
      if (step.type === "video" && !isValidVideoUrl(step.content)) {
        setError(
          `Step ${i + 1}: Please enter a valid YouTube or Vimeo embed URL`
        );
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // Get current skill tree data
      const skillTree = await skillTreeAPI.getSkillTree(skillTreeId);

      // Make sure nodes is an array even if it's null or undefined
      const currentNodes = Array.isArray(skillTree.nodes)
        ? skillTree.nodes
        : [];

      // Create a properly formatted node object
      const nodeData = {
        title: formData.title,
        steps: formData.steps.map((step) => ({
          title: step.title,
          type: step.type,
          content: step.content,
          id:
            step.id ||
            `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID if not exists
        })),
      };

      let updatedNodes;

      if (isEditMode && nodeIndex !== null) {
        // Edit existing node
        updatedNodes = [...currentNodes];
        updatedNodes[nodeIndex] = nodeData;
        console.log("Editing node at index:", nodeIndex);
      } else {
        // Add new node
        updatedNodes = [...currentNodes, nodeData];
        console.log("Adding new node");
      }

      console.log("Updated nodes:", updatedNodes);

      // Update skill tree with new nodes array
      const result = await skillTreeAPI.updateSkillTree(skillTreeId, {
        ...skillTree,
        nodes: updatedNodes,
      });

      if (onSuccess) {
        onSuccess(result);
      }

      onClose();
    } catch (err) {
      console.error("Error saving node:", err);
      setError(err.detail || "Failed to save node. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to validate video URLs
  const isValidVideoUrl = (url) => {
    // Simple validation for YouTube and Vimeo embed URLs
    return (
      url.includes("youtube.com/embed/") ||
      url.includes("player.vimeo.com/video/")
    );
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          backgroundColor: darkMode ? "#353535" : "#ffffff",
          color: darkMode ? "#d7d7d6" : "#403f3f",
        },
      }}
    >
      <DialogTitle>
        {isEditMode ? "Edit Learning Node" : "Add New Learning Node"}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Node Title"
          value={formData.title}
          onChange={handleTitleChange}
          fullWidth
          required
          margin="normal"
          InputProps={{
            style: { color: darkMode ? "#d7d7d6" : "#403f3f" },
          }}
          InputLabelProps={{
            style: { color: darkMode ? "#b3b3b3" : undefined },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: darkMode ? "#555" : undefined,
              },
              "&:hover fieldset": {
                borderColor: darkMode ? "#777" : undefined,
              },
            },
          }}
        />

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Learning Steps
        </Typography>

        {formData.steps.map((step, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              mb: 2,
              border: "1px solid",
              borderColor: darkMode ? "#555" : "#e0e0e0",
              borderRadius: 1,
              position: "relative",
            }}
          >
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                Step {index + 1}
              </Typography>
              <IconButton
                size="small"
                color="error"
                onClick={() => removeStep(index)}
                disabled={formData.steps.length <= 1}
              >
                <Delete />
              </IconButton>
            </Stack>

            <TextField
              label="Step Title"
              value={step.title}
              onChange={(e) => handleStepChange(index, "title", e.target.value)}
              fullWidth
              required
              margin="normal"
              InputProps={{
                style: { color: darkMode ? "#d7d7d6" : "#403f3f" },
              }}
              InputLabelProps={{
                style: { color: darkMode ? "#b3b3b3" : undefined },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "#555" : undefined,
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#777" : undefined,
                  },
                },
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "#555" : undefined,
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#777" : undefined,
                  },
                },
              }}
            >
              <InputLabel
                id={`step-type-label-${index}`}
                style={{ color: darkMode ? "#b3b3b3" : undefined }}
              >
                Content Type
              </InputLabel>
              <Select
                labelId={`step-type-label-${index}`}
                value={step.type}
                onChange={(e) =>
                  handleStepChange(index, "type", e.target.value)
                }
                label="Content Type"
                required
                sx={{ color: darkMode ? "#d7d7d6" : "#403f3f" }}
              >
                {STEP_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={
                step.type === "text"
                  ? "Text Content"
                  : step.type === "video"
                  ? "Video Embed URL (YouTube/Vimeo)"
                  : "Problem Name"
              }
              value={step.content}
              onChange={(e) =>
                handleStepChange(index, "content", e.target.value)
              }
              fullWidth
              required
              margin="normal"
              multiline={step.type === "text"}
              rows={step.type === "text" ? 4 : 1}
              helperText={
                step.type === "video"
                  ? "Example: https://www.youtube.com/embed/VIDEO_ID"
                  : step.type === "problem"
                  ? "Enter the name of the practice problem"
                  : ""
              }
              InputProps={{
                style: { color: darkMode ? "#d7d7d6" : "#403f3f" },
              }}
              InputLabelProps={{
                style: { color: darkMode ? "#b3b3b3" : undefined },
              }}
              FormHelperTextProps={{
                style: { color: darkMode ? "#999" : undefined },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "#555" : undefined,
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#777" : undefined,
                  },
                },
              }}
            />
          </Box>
        ))}

        <Button
          startIcon={<Add />}
          onClick={addStep}
          variant="outlined"
          sx={{
            mt: 1,
            color: darkMode ? "#2196f3" : "#1976d2",
            borderColor: darkMode ? "#2196f3" : "#1976d2",
          }}
        >
          Add Step
        </Button>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ color: darkMode ? "#b3b3b3" : "#555" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
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
            backgroundColor: darkMode ? "#2196f3" : "#1976d2",
            "&:hover": { backgroundColor: darkMode ? "#1976d2" : "#1565c0" },
          }}
        >
          {loading ? "Saving..." : isEditMode ? "Update Node" : "Save Node"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeForm;
