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
  useTheme,
  Container,
  Chip,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";
import {
  Person,
  Add,
  MoreVert,
  Edit,
  Delete,
  CalendarToday,
  School,
  Code,
  Schedule,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { skillTreeAPI } from "../../services/skillTreeAPI";
import SkillTreeForm from "./SkillTreeForm";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  hover: {
    y: -5,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

function SkillTreeHome({ darkMode }) {
  const navigate = useNavigate();
  const theme = useTheme();

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

  // Function to fetch skill trees - used for initial load and retry
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

  // Fetch skill trees on component mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await skillTreeAPI.getAllSkillTrees();
        // Only update state if component is still mounted
        if (isMounted) {
          setSkillTrees(data);
        }
      } catch (err) {
        console.error("Failed to load skill trees:", err);
        if (isMounted) {
          setError("Failed to load skill trees. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Return a proper cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMenuOpen = (event, skillTreeId) => {
    event.stopPropagation();
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

  const renderSkeletonCards = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
          <Card
            sx={{
              borderRadius: theme.shape.borderRadius * 1.5,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: 100,
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Skeleton variant="text" width={150} height={32} />
                  <Skeleton variant="text" width={100} height={24} />
                </Box>
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
            </Box>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Skeleton variant="text" width={120} />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Skeleton variant="circular" width={50} height={50} />
                  <Skeleton variant="text" width={30} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ));
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Your Skill Trees
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Track your progress and continue learning
        </Typography>
        <Grid container spacing={3}>
          {renderSkeletonCards()}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="md"
        sx={{
          py: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <Typography
          variant="h4"
          color="error"
          gutterBottom
          sx={{
            mb: 3,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {error}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, textAlign: "center", maxWidth: "600px" }}
        >
          We're having trouble loading your skill trees. This could be due to
          network issues or server problems.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={fetchSkillTrees}
          startIcon={<Schedule />}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Enhanced header section with visual divider and improved typography */}
      <Box
        sx={{
          mb: 4,
          pb: 3,
          borderBottom: `1px solid ${
            darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
          }`,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "flex-end" },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: darkMode
                ? "linear-gradient(90deg, #2196f3 0%, #82b1ff 100%)"
                : "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Skill Trees
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: darkMode ? "#bdbdbd" : "text.secondary",
              maxWidth: "600px",
            }}
          >
            Track your learning progress and organize your educational journey
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => {
            setEditData(null);
            setFormOpen(true);
          }}
          sx={{
            mt: { xs: 2, md: 0 },
            borderColor: darkMode ? "#2196f3" : "#1976d2",
            color: darkMode ? "#2196f3" : "#1976d2",
            "&:hover": {
              borderColor: darkMode ? "#82b1ff" : "#1976d2",
              backgroundColor: darkMode
                ? "rgba(33, 150, 243, 0.08)"
                : "rgba(25, 118, 210, 0.08)",
            },
          }}
        >
          Create New Tree
        </Button>
      </Box>

      {skillTrees.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 12,
              px: 3,
              textAlign: "center",
              bgcolor: darkMode
                ? "rgba(33, 150, 243, 0.05)"
                : "rgba(25, 118, 210, 0.03)",
              borderRadius: "16px",
              border: `1px dashed ${
                darkMode ? "rgba(33, 150, 243, 0.3)" : "rgba(25, 118, 210, 0.2)"
              }`,
            }}
          >
            <Box
              sx={{
                bgcolor: darkMode
                  ? "rgba(33, 150, 243, 0.1)"
                  : "rgba(25, 118, 210, 0.08)",
                p: 4,
                borderRadius: "50%",
                mb: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Code
                sx={{ fontSize: 70, color: darkMode ? "#2196f3" : "#1976d2" }}
              />
            </Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: darkMode ? "#f5f5f5" : "#333333",
              }}
            >
              Create Your First Skill Tree
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? "#bdbdbd" : "#666666",
                mb: 4,
                maxWidth: 500,
                lineHeight: 1.6,
              }}
            >
              Organize your learning materials, track progress, and structure
              your educational journey. Start by creating your first skill tree.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => {
                setEditData(null);
                setFormOpen(true);
              }}
              sx={{
                backgroundColor: darkMode ? "#2196f3" : "#1976d2",
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: darkMode ? "#1976d2" : "#1565c0",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              Create Skill Tree
            </Button>
          </Box>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {skillTrees.map((tree) => (
              <Grid item xs={12} sm={6} md={4} key={tree.id}>
                <motion.div variants={itemVariants} whileHover="hover">
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      bgcolor: darkMode ? "#424242" : "#ffffff",
                      color: darkMode ? "#d7d7d6" : "inherit",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: darkMode
                        ? "0 8px 16px rgba(0, 0, 0, 0.4)"
                        : "0 6px 16px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <CardActionArea
                      onClick={() => navigate(`/skillTree/${tree.id}`)}
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
                      {/* Enhanced Header */}
                      <Box
                        sx={{
                          p: 2.5,
                          background: `linear-gradient(45deg, ${
                            tree.bg_color
                          } 30%, ${alpha(tree.bg_color, 0.8)} 90%)`,
                          color: "#fff",
                          position: "relative", // For gradient overlay
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(to right, rgba(0,0,0,0.1), transparent)",
                            pointerEvents: "none",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                            position: "relative", // To appear above the gradient overlay
                            zIndex: 1,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                mb: 1,
                                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                              }}
                            >
                              {tree.title}
                            </Typography>
                            {tree.guide && (
                              <Chip
                                label={`Guide: ${tree.guide}`}
                                size="small"
                                sx={{
                                  bgcolor: alpha("#ffffff", 0.2),
                                  color: "#ffffff",
                                  "& .MuiChip-label": { px: 1 },
                                  backdropFilter: "blur(4px)",
                                  fontWeight: 500,
                                }}
                                icon={
                                  <School
                                    sx={{ color: "#ffffff !important" }}
                                  />
                                }
                              />
                            )}
                          </Box>
                          <Avatar
                            sx={{
                              bgcolor: alpha("#ffffff", 0.2),
                              width: 42,
                              height: 42,
                              backdropFilter: "blur(4px)",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            }}
                          >
                            <Person />
                          </Avatar>
                        </Box>
                      </Box>

                      {/* Enhanced Content */}
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          p: 3,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 3,
                            color: darkMode ? "#bdbdbd" : "text.secondary",
                            lineHeight: 1.6,
                          }}
                        >
                          {tree.description || "No description available"}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: "auto",
                            pt: 2,
                            borderTop: `1px solid ${
                              darkMode
                                ? "rgba(255,255,255,0.08)"
                                : "rgba(0,0,0,0.05)"
                            }`,
                          }}
                        >
                          {tree.next_deadline ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                bgcolor: darkMode
                                  ? "rgba(244, 67, 54, 0.1)"
                                  : "rgba(244, 67, 54, 0.05)",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: "16px",
                              }}
                            >
                              <CalendarToday fontSize="small" color="error" />
                              <Typography
                                variant="body2"
                                color="error.main"
                                sx={{ fontWeight: 500 }}
                              >
                                Due:{" "}
                                {new Date(
                                  tree.next_deadline
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                          ) : (
                            <Box /> // Empty space for alignment
                          )}

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              position: "relative",
                            }}
                          >
                            <Box sx={{ position: "relative" }}>
                              <CircularProgress
                                variant="determinate"
                                value={100}
                                size={44}
                                thickness={4}
                                sx={{
                                  color: darkMode
                                    ? "rgba(255,255,255,0.1)"
                                    : "rgba(0,0,0,0.08)",
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                }}
                              />
                              <CircularProgress
                                variant="determinate"
                                value={tree.percentage_completed || 0}
                                size={44}
                                thickness={4}
                                sx={{
                                  color: tree.bg_color,
                                  "& .MuiCircularProgress-circle": {
                                    strokeLinecap: "round",
                                  },
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color: darkMode ? "#f5f5f5" : "#333333",
                              }}
                            >
                              {tree.percentage_completed || 0}%
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>

                    {/* Enhanced Actions */}
                    <Tooltip title="Options">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, tree.id)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "#ffffff",
                          bgcolor: alpha("#000000", 0.2),
                          backdropFilter: "blur(4px)",
                          "&:hover": {
                            bgcolor: alpha("#000000", 0.4),
                          },
                          zIndex: 2,
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}

      {/* Enhanced floating action button */}
      <Tooltip title="Create new skill tree">
        <Fab
          color="primary"
          aria-label="add skill tree"
          onClick={() => {
            setEditData(null);
            setFormOpen(true);
          }}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            bgcolor: darkMode ? "#2196f3" : "#1976d2",
            "&:hover": {
              bgcolor: darkMode ? "#1976d2" : "#1565c0",
            },
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Add />
        </Fab>
      </Tooltip>

      {/* Menu for edit/delete actions */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
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
      >
        <DialogTitle>Delete Skill Tree</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteTarget?.title}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default SkillTreeHome;
