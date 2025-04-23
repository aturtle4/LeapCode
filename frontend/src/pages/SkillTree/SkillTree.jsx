import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Collapse,
  Button,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  ArrowBack,
  ExpandLess,
  ExpandMore,
  OpenInNew,
  School,
  MoreVert,
  LinkOff,
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";
import { googleClassroomAPI } from "../../services/googleClassroomAPI";
import { skillTreeAPI } from "../../services/skillTreeAPI";
import LinkClassroomModal from "../../components/SkillTree/LinkClassroomModal";
import NodeForm from "../../components/SkillTree/NodeForm";

function SkillTree({ darkMode, toggleDarkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedSteps, setExpandedSteps] = useState({});
  const [classroom, setClassroom] = useState(null);
  const [skillTree, setSkillTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Node form states
  const [nodeFormOpen, setNodeFormOpen] = useState(false);
  const [editNodeData, setEditNodeData] = useState(null);
  const [editNodeIndex, setEditNodeIndex] = useState(null);

  // Node deletion states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);

  // Node action menu
  const [nodeMenuAnchorEl, setNodeMenuAnchorEl] = useState(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);

  // Classroom linking states
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const nodeMenuOpen = Boolean(nodeMenuAnchorEl);

  // Fetch skill tree data and associated Google Classroom on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch skill tree data
        const treeData = await skillTreeAPI.getSkillTree(id);
        setSkillTree(treeData);

        // Fetch associated classroom if there is one
        try {
          const classroomData =
            await googleClassroomAPI.getClassroomForSkillTree(id);
          setClassroom(classroomData);
        } catch (classroomErr) {
          // It's ok if there's no classroom associated yet
          console.log("No classroom linked to this skill tree");
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load skill tree:", err);
        setError(err.detail || "Failed to load skill tree. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle opening classroom
  const handleOpenClassroom = () => {
    if (classroom && classroom.url) {
      googleClassroomAPI.openClassroom(classroom.url);
    } else {
      setSnackbarMessage("No classroom associated with this skill tree");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const toggleStep = (nodeIndex, stepIndex) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [`${nodeIndex}-${stepIndex}`]: !prev[`${nodeIndex}-${stepIndex}`],
    }));
  };

  // Handle a successful node addition
  const handleNodeAdded = (updatedSkillTree) => {
    setSkillTree(updatedSkillTree);
    setSnackbarMessage("New learning node added successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  // Handle node updates
  const handleNodeUpdated = (updatedSkillTree) => {
    setSkillTree(updatedSkillTree);
    setEditNodeData(null);
    setEditNodeIndex(null);
    setSnackbarMessage("Node updated successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  // Handle node menu open
  const handleNodeMenuOpen = (event, index) => {
    event.stopPropagation();
    setNodeMenuAnchorEl(event.currentTarget);
    setSelectedNodeIndex(index);
  };

  // Handle node menu close
  const handleNodeMenuClose = () => {
    setNodeMenuAnchorEl(null);
    setSelectedNodeIndex(null);
  };

  // Handle node edit
  const handleEditNode = () => {
    const nodeToEdit = skillTree.nodes[selectedNodeIndex];
    setEditNodeData(nodeToEdit);
    setEditNodeIndex(selectedNodeIndex);
    setNodeFormOpen(true);
    handleNodeMenuClose();
  };

  // Handle node delete click
  const handleDeleteNodeClick = () => {
    setNodeToDelete(selectedNodeIndex);
    setDeleteDialogOpen(true);
    handleNodeMenuClose();
  };

  // Handle node delete confirmation
  const confirmDeleteNode = async () => {
    if (nodeToDelete === null) return;

    try {
      // Create a copy of nodes array without the node to delete
      const updatedNodes = [...skillTree.nodes];
      updatedNodes.splice(nodeToDelete, 1);

      // Update skill tree with the new nodes array
      const result = await skillTreeAPI.updateSkillTree(id, {
        ...skillTree,
        nodes: updatedNodes,
      });

      setSkillTree(result);
      setSnackbarMessage("Node deleted successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Failed to delete node:", err);
      setSnackbarMessage("Failed to delete node");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setDeleteDialogOpen(false);
      setNodeToDelete(null);
    }
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
          sx={{ color: darkMode ? "#2196f3" : "#1976d2" }}
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: darkMode ? "#353535" : "#d9d9d9",
          color: darkMode ? "#d7d7d6" : "#403f3f",
          padding: "20px",
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/home")}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  if (!skillTree) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: darkMode ? "#353535" : "#d9d9d9",
          color: darkMode ? "#d7d7d6" : "#403f3f",
          padding: "20px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Skill Tree Not Found
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/home")}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <div style={{ backgroundColor: darkMode ? "#353535" : "#d9d9d9" }}>
      <Box
        sx={{
          minHeight: "100vh",
          maxHeight: "100vh",
          backgroundColor: darkMode ? "#353535" : "#d9d9d9",
          color: darkMode ? "#d7d7d6" : "#403f3f",
          padding: "20px",
        }}
      >
        {/* Header */}
        <Paper
          sx={{
            padding: "20px",
            borderRadius: "20px",
            backgroundColor: skillTree.bg_color,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={() => navigate("/home")} sx={{ color: "#fff" }}>
            <ArrowBack fontSize="large" />
          </IconButton>
          <Box sx={{ textAlign: "center", flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold" color="#fff">
              {skillTree.title}
            </Typography>
            {skillTree.guide && (
              <Typography variant="body1" color="#fff">
                Guide: {skillTree.guide}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              <>
                {classroom ? (
                  <Tooltip title={`Open ${classroom.name}`}>
                    <IconButton
                      onClick={handleOpenClassroom}
                      sx={{ color: "#fff", mr: 1 }}
                      aria-label="Open classroom"
                    >
                      <School fontSize="large" />
                    </IconButton>
                  </Tooltip>
                ) : null}

                <Tooltip title="Classroom settings">
                  <IconButton
                    onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                    sx={{ color: "#fff" }}
                    aria-label="Classroom settings"
                  >
                    <MoreVert fontSize="large" />
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={menuAnchorEl}
                  open={menuOpen}
                  onClose={() => setMenuAnchorEl(null)}
                  PaperProps={{
                    sx: {
                      backgroundColor: darkMode ? "#424242" : "#ffffff",
                      color: darkMode ? "#d7d7d6" : "#403f3f",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setMenuAnchorEl(null);
                      setLinkModalOpen(true);
                    }}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <School fontSize="small" />
                    {classroom ? "Change classroom link" : "Link to classroom"}
                  </MenuItem>

                  {classroom && (
                    <MenuItem
                      onClick={async () => {
                        try {
                          setMenuAnchorEl(null);
                          await googleClassroomAPI.unlinkSkillTreeFromClassroom(
                            id
                          );
                          setClassroom(null);
                          setSnackbarMessage(
                            "Classroom link removed successfully"
                          );
                          setSnackbarSeverity("success");
                          setOpenSnackbar(true);
                        } catch (err) {
                          console.error("Failed to unlink classroom:", err);
                          setSnackbarMessage("Failed to remove classroom link");
                          setSnackbarSeverity("error");
                          setOpenSnackbar(true);
                        }
                      }}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <LinkOff fontSize="small" />
                      Remove classroom link
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Box>
        </Paper>

        {/* Skill Tree Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            marginTop: "20px",
            maxHeight: "85vh",
            overflowY: "auto",
            pb: 10, // Add padding at bottom to make space for FAB
          }}
        >
          {skillTree.nodes && skillTree.nodes.length > 0 ? (
            skillTree.nodes.map((node, nodeIndex) => (
              <Paper
                key={nodeIndex}
                sx={{
                  padding: "20px",
                  borderRadius: "20px",
                  backgroundColor: darkMode ? "#424242" : "#ffffff",
                  color: darkMode ? "#d7d7d6" : "#403f3f",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {node.title || `Node ${nodeIndex + 1}`}
                  </Typography>
                  <IconButton
                    onClick={(event) => handleNodeMenuOpen(event, nodeIndex)}
                  >
                    <MoreVert
                      style={{ color: darkMode ? "#d7d7d6" : "#403f3f" }}
                    />
                  </IconButton>
                </Box>

                <Menu
                  anchorEl={nodeMenuAnchorEl}
                  open={nodeMenuOpen}
                  onClose={handleNodeMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: darkMode ? "#424242" : "#ffffff",
                      color: darkMode ? "#d7d7d6" : "#403f3f",
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleEditNode}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Edit fontSize="small" />
                    Edit Node
                  </MenuItem>
                  <MenuItem
                    onClick={handleDeleteNodeClick}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Delete fontSize="small" />
                    Delete Node
                  </MenuItem>
                </Menu>

                {node.steps.map((step, stepIndex) => (
                  <Box key={stepIndex} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body1" fontWeight="bold">
                        {step.title || `Step ${stepIndex + 1}`}
                      </Typography>
                      <IconButton
                        onClick={() => toggleStep(nodeIndex, stepIndex)}
                      >
                        {expandedSteps[`${nodeIndex}-${stepIndex}`] ? (
                          <ExpandLess
                            style={{ color: darkMode ? "#d7d7d6" : "#403f3f" }}
                          />
                        ) : (
                          <ExpandMore
                            style={{ color: darkMode ? "#d7d7d6" : "#403f3f" }}
                          />
                        )}
                      </IconButton>
                    </Box>
                    <Collapse in={expandedSteps[`${nodeIndex}-${stepIndex}`]}>
                      {step.type === "video" && (
                        <Box sx={{ mt: 2 }}>
                          <iframe
                            width="100%"
                            height="315"
                            src={step.content}
                            title={`Video ${stepIndex + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </Box>
                      )}

                      {step.type === "text" && (
                        <Typography variant="body1" sx={{ mt: 2 }}>
                          {step.content}
                        </Typography>
                      )}

                      {step.type === "problem" && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" fontWeight="bold">
                            Problem:
                          </Typography>
                          <IconButton
                            onClick={() =>
                              navigate(
                                `/skillTree/${id}/PracticeProblem/${step.content}/${step.id}`
                              )
                            }
                            sx={{
                              mt: 1,
                              padding: "10px 15px",
                              borderRadius: "10px",
                              backgroundColor: darkMode ? "#2196f3" : "#1976d2",
                              color: "#fff",
                              "&:hover": {
                                backgroundColor: darkMode
                                  ? "#1976d2"
                                  : "#1565c0",
                              },
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {step.content}
                            </Typography>
                          </IconButton>
                        </Box>
                      )}
                    </Collapse>
                  </Box>
                ))}
              </Paper>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                No learning nodes available yet
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Get started by adding your first learning node to this skill
                tree
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setNodeFormOpen(true)}
                sx={{
                  backgroundColor: darkMode ? "#2196f3" : "#1976d2",
                  "&:hover": {
                    backgroundColor: darkMode ? "#1976d2" : "#1565c0",
                  },
                }}
              >
                Add First Node
              </Button>
            </Box>
          )}
        </Box>

        {/* Floating Action Button for adding nodes (only shown if nodes already exist) */}
        {skillTree.nodes && skillTree.nodes.length > 0 && (
          <Fab
            color="primary"
            aria-label="add node"
            onClick={() => setNodeFormOpen(true)}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              backgroundColor: darkMode ? "#2196f3" : "#1976d2",
              "&:hover": { backgroundColor: darkMode ? "#1976d2" : "#1565c0" },
            }}
          >
            <Add />
          </Fab>
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Classroom linking modal */}
        <LinkClassroomModal
          open={linkModalOpen}
          onClose={() => setLinkModalOpen(false)}
          skillTreeId={id}
          darkMode={darkMode}
          onSuccess={(linkedClassroom) => {
            setClassroom(linkedClassroom);
            setSnackbarMessage(
              `Successfully linked to classroom: ${linkedClassroom.name}`
            );
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
          }}
        />

        {/* Node form modal */}
        <NodeForm
          open={nodeFormOpen}
          onClose={() => {
            setNodeFormOpen(false);
            setEditNodeData(null);
            setEditNodeIndex(null);
          }}
          skillTreeId={id}
          darkMode={darkMode}
          onSuccess={editNodeData ? handleNodeUpdated : handleNodeAdded}
          editData={editNodeData}
          nodeIndex={editNodeIndex}
        />

        {/* Node delete confirmation dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Delete Node</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this node? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDeleteNode} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}

export default SkillTree;
