import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Fab,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Person, Add, MoreVert, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { skillTreeAPI } from "../../services/skillTreeAPI";
import SkillTreeForm from "./SkillTreeForm";

function SkillTreeHome({ darkMode }) {
  const navigate = useNavigate();

  const [skillTrees, setSkillTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedTreeId, setSelectedTreeId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch skill trees on component mount
  useEffect(() => {
    fetchSkillTrees();
  }, []);

  const fetchSkillTrees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await skillTreeAPI.getAllSkillTrees();
      setSkillTrees(data);
    } catch (err) {
      console.error("Failed to load skill trees:", err);
      setError("Failed to load skill trees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, skillTreeId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedTreeId(skillTreeId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedTreeId(null);
  };

  const handleEdit = () => {
    const treeToEdit = skillTrees.find((tree) => tree.id === selectedTreeId);
    setEditData(treeToEdit);
    setFormOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    const treeToDelete = skillTrees.find((tree) => tree.id === selectedTreeId);
    setDeleteTarget(treeToDelete);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await skillTreeAPI.deleteSkillTree(deleteTarget.id);
      setSkillTrees(skillTrees.filter((tree) => tree.id !== deleteTarget.id));
      setSnackbar({
        open: true,
        message: `"${deleteTarget.title}" has been deleted`,
        severity: "success",
      });
    } catch (err) {
      console.error("Failed to delete skill tree:", err);
      setSnackbar({
        open: true,
        message: `Failed to delete "${deleteTarget.title}"`,
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleFormSuccess = (result) => {
    if (editData) {
      // Update existing skill tree in the list
      setSkillTrees(
        skillTrees.map((tree) => (tree.id === result.id ? result : tree))
      );
    } else {
      // Add new skill tree to the list
      setSkillTrees([...skillTrees, result]);
    }

    // Close form and reset edit data
    setFormOpen(false);
    setEditData(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: darkMode ? "#353535" : "#d9d9d9",
        }}
      >
        <CircularProgress
          size={60}
          sx={{ color: darkMode ? "#90caf9" : "#1976d2" }}
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          padding: "70px 125px",
          minHeight: "100vh",
          backgroundColor: darkMode ? "#353535" : "#d9d9d9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchSkillTrees} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "70px 125px",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#353535" : "#d9d9d9",
        position: "relative",
      }}
    >
      {skillTrees.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: darkMode ? "#d7d7d6" : "#403f3f",
              mb: 4,
              textAlign: "center",
            }}
          >
            No skill trees found. Create your first one!
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditData(null);
              setFormOpen(true);
            }}
            sx={{
              backgroundColor: "#3498db",
              "&:hover": { backgroundColor: "#2980b9" },
            }}
          >
            Create Skill Tree
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {skillTrees.map((tree) => (
            <Grid item xs={12} sm={6} md={4} key={tree.id}>
              <Card
                sx={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  backgroundColor: darkMode ? "#353535" : "#ffffff",
                  color: darkMode ? "#d7d7d6" : "#403f3f",
                  display: "flex",
                  flexDirection: "column",
                  height: "200px",
                  width: "100%", // Ensure card takes full width of grid item
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                  position: "relative",
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/skillTree/${tree.id}`)}
                >
                  {/* Top Section (Title & Guide) */}
                  <Box
                    sx={{
                      backgroundColor: tree.bg_color,
                      padding: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {tree.title}
                      </Typography>
                      {tree.guide && (
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {tree.guide}
                        </Typography>
                      )}
                    </Box>

                    {/* Show Avatar only if private (i.e., has a guide) */}
                    {tree.guide && (
                      <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.3)" }}>
                        <Person />
                      </Avatar>
                    )}
                  </Box>

                  {/* Bottom Section (Deadline & Progress) */}
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexGrow: 1,
                      }}
                    >
                      {/* Next Deadline (only for private trees) */}
                      {tree.next_deadline ? (
                        <Typography variant="body2" color="red">
                          Next Deadline:{" "}
                          {new Date(tree.next_deadline).toLocaleDateString()}
                        </Typography>
                      ) : (
                        <Box sx={{ width: "50px" }} /> // Empty space for alignment
                      )}

                      {/* Circular Progress (Aligned to Right) */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={tree.percentage_completed || 0}
                          size={50}
                          thickness={5}
                          sx={{ color: tree.bg_color }}
                        />
                        <Typography variant="h6">
                          {tree.percentage_completed || 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>

                {/* Actions menu (Not part of CardActionArea) */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, tree.id);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <MoreVert />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating action button to add new skill tree */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => {
          setEditData(null);
          setFormOpen(true);
        }}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          backgroundColor: darkMode ? "#1e88e5" : "#1976d2",
          "&:hover": { backgroundColor: darkMode ? "#1565c0" : "#1565c0" },
        }}
      >
        <Add />
      </Fab>

      {/* Menu for edit/delete actions */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: darkMode ? "#424242" : "#ffffff",
            color: darkMode ? "#d7d7d6" : "#403f3f",
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "#f44336" }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Skill tree form dialog */}
      <SkillTreeForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditData(null);
        }}
        darkMode={darkMode}
        onSuccess={handleFormSuccess}
        editData={editData}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: darkMode ? "#353535" : "#ffffff",
            color: darkMode ? "#d7d7d6" : "#403f3f",
          },
        }}
      >
        <DialogTitle>Delete Skill Tree</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: darkMode ? "#b3b3b3" : undefined }}>
            Are you sure you want to delete "{deleteTarget?.title}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: darkMode ? "#90caf9" : "#1976d2" }}
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
    </Box>
  );
}

export default SkillTreeHome;
