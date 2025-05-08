import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
  Alert
} from "@mui/material";
import {
  Add,
  Search,
  Edit,
  Delete
} from "@mui/icons-material";
import { problemAPI } from "../../services/problemAPI";
import ProblemForm from "../../components/Problem/ProblemForm";

const difficultyColors = {
  easy: "success",
  medium: "warning",
  hard: "error",
};

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchProblems();
    
    // Check for new problem query parameter
    const queryParams = new URLSearchParams(location.search);
    const newProblemName = queryParams.get('new');
    
    if (newProblemName) {
      // Pre-fill the problem form with the name from the query parameter
      setEditData({
        title: newProblemName,
        description: "",
        difficulty: "medium",
        input_format: "",
        output_format: "",
        constraints: "",
        time_limit: 1000,
        memory_limit: 256,
        starter_code: {},
        problem_ref_id: ""
      });
      setFormOpen(true);
    }
  }, [location.search]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const data = await problemAPI.getAllProblems();
      setProblems(data);
      setError(null);
    } catch (err) {
      setError("Failed to load problems. Please try again.");
      console.error("Error fetching problems:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditData(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (problem) => {
    setEditData(problem);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditData(null);
  };

  const handleSuccess = () => {
    fetchProblems();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await problemAPI.deleteProblem(id);
        setProblems(problems.filter((p) => p.id !== id));
      } catch (err) {
        setError("Failed to delete problem");
        console.error("Error deleting problem:", err);
      }
    }
  };

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.problem_ref_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Coding Problems
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenCreate}
          >
            Create Problem
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Search Problems"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: loading && (
                <InputAdornment position="end">
                  <CircularProgress size={24} />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {loading && problems.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : filteredProblems.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              No problems found
            </Typography>
            {searchQuery && (
              <Typography variant="body2" color="textSecondary">
                Try adjusting your search criteria
              </Typography>
            )}
            {!searchQuery && problems.length === 0 && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Add />}
                  onClick={handleOpenCreate}
                >
                  Create your first problem
                </Button>
              </Box>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredProblems.map((problem) => (
              <Grid item xs={12} sm={6} md={4} key={problem.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" component="h2" noWrap>
                        {problem.title}
                      </Typography>
                      <Chip
                        label={problem.difficulty || "medium"}
                        color={difficultyColors[problem.difficulty] || "default"}
                        size="small"
                      />
                    </Box>

                    {problem.problem_ref_id && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 1 }}
                      >
                        ID: {problem.problem_ref_id}
                      </Typography>
                    )}

                    <Divider sx={{ my: 1 }} />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {problem.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleOpenEdit(problem)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(problem.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <ProblemForm
        open={formOpen}
        onClose={handleCloseForm}
        onSuccess={handleSuccess}
        editData={editData}
      />
    </Container>
  );
};

export default ProblemsPage;