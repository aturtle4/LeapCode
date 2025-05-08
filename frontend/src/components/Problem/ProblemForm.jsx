import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { problemAPI } from "../../services/problemAPI";
import TestCaseForm from "./TestCaseForm";

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`problem-tabpanel-${index}`}
      aria-labelledby={`problem-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const SUPPORTED_LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
];

const ProblemForm = ({ open, onClose, darkMode, onSuccess, editData = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [testCases, setTestCases] = useState([]);
  const [testCaseError, setTestCaseError] = useState(null);
  const isEditMode = !!editData;
  
  const [formData, setFormData] = useState({
    title: "",
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

  // For starter code management
  const [currentLanguage, setCurrentLanguage] = useState("python");
  const [starterCode, setStarterCode] = useState({
    python: "# Write your Python code here\n",
    javascript: "// Write your JavaScript code here\n",
    java: "// Write your Java code here\n"
  });

  useEffect(() => {
    if (open && editData) {
      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        difficulty: editData.difficulty || "medium",
        input_format: editData.input_format || "",
        output_format: editData.output_format || "",
        constraints: editData.constraints || "",
        time_limit: editData.time_limit || 1000,
        memory_limit: editData.memory_limit || 256,
        problem_ref_id: editData.problem_ref_id || "",
        starter_code: editData.starter_code || {}
      });
      
      // Load test cases if in edit mode
      if (editData.id) {
        loadTestCases(editData.id);
      }
      
      // Set starter code
      if (editData.starter_code) {
        setStarterCode({
          ...starterCode,
          ...editData.starter_code
        });
      }
    } else {
      // Reset form when opening in create mode
      setFormData({
        title: "",
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
      setTestCases([]);
      setActiveTab(0);
    }
  }, [open, editData, starterCode]);

  const loadTestCases = async (problemId) => {
    try {
      const testCasesData = await problemAPI.getTestCases(problemId);
      setTestCases(testCasesData);
    } catch (err) {
      console.error("Failed to load test cases:", err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStarterCodeChange = (e) => {
    const updatedStarterCode = {
      ...starterCode,
      [currentLanguage]: e.target.value
    };
    
    setStarterCode(updatedStarterCode);
    setFormData({
      ...formData,
      starter_code: updatedStarterCode
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare data with starter code
      const problemData = {
        ...formData,
        starter_code: starterCode
      };
      
      let response;
      if (isEditMode) {
        response = await problemAPI.updateProblem(editData.id, problemData);
      } else {
        response = await problemAPI.createProblem(problemData);
      }
      
      setLoading(false);
      if (onSuccess) onSuccess(response);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || "An error occurred. Please try again.");
      console.error("Form submission error:", err);
    }
  };

  const handleAddTestCase = async (testCaseData) => {
    setTestCaseError(null);
    
    if (!isEditMode) {
      setError("Please save the problem first before adding test cases.");
      return;
    }
    
    try {
      const newTestCase = {
        ...testCaseData,
        problem_id: editData.id
      };
      
      const response = await problemAPI.createTestCase(newTestCase);
      setTestCases([...testCases, response]);
    } catch (err) {
      setTestCaseError(err.response?.data?.detail || "Failed to add test case");
      console.error("Failed to add test case:", err);
    }
  };

  const handleDeleteTestCase = async (testCaseId) => {
    try {
      await problemAPI.deleteTestCase(testCaseId);
      setTestCases(testCases.filter(tc => tc.id !== testCaseId));
    } catch (err) {
      setTestCaseError("Failed to delete test case");
      console.error("Failed to delete test case:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {isEditMode ? "Edit Problem" : "Create New Problem"}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="problem tabs">
            <Tab label="Basic Info" />
            <Tab label="Problem Details" />
            <Tab label="Starter Code" />
            {isEditMode && <Tab label="Test Cases" />}
          </Tabs>
        </Box>

        {/* Basic Info Tab */}
        <TabPanel value={activeTab} index={0}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Problem ID (used in skill tree references)"
            name="problem_ref_id"
            value={formData.problem_ref_id}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            helperText="A unique identifier for referencing this problem (e.g., P001)"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Difficulty</InputLabel>
            <Select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              label="Difficulty"
            >
              {DIFFICULTY_LEVELS.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Time Limit (ms)"
              name="time_limit"
              type="number"
              value={formData.time_limit}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{ inputProps: { min: 100 } }}
            />
            <TextField
              label="Memory Limit (MB)"
              name="memory_limit"
              type="number"
              value={formData.memory_limit}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{ inputProps: { min: 16 } }}
            />
          </Box>
        </TabPanel>

        {/* Problem Details Tab */}
        <TabPanel value={activeTab} index={1}>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={6}
            margin="normal"
            required
            helperText="Detailed problem description (supports markdown)"
          />

          <TextField
            label="Input Format"
            name="input_format"
            value={formData.input_format}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            helperText="Description of input format"
          />

          <TextField
            label="Output Format"
            name="output_format"
            value={formData.output_format}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            helperText="Description of expected output format"
          />

          <TextField
            label="Constraints"
            name="constraints"
            value={formData.constraints}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            helperText="Problem constraints (e.g., limits on input sizes)"
          />
        </TabPanel>

        {/* Starter Code Tab */}
        <TabPanel value={activeTab} index={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Language</InputLabel>
            <Select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              label="Language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={`${SUPPORTED_LANGUAGES.find(l => l.value === currentLanguage)?.label} Starter Code`}
            value={starterCode[currentLanguage]}
            onChange={handleStarterCodeChange}
            fullWidth
            multiline
            rows={10}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputLabel sx={{ position: 'absolute', top: -10, left: 0, fontSize: '0.75rem' }}>
                  Starter code provided to students
                </InputLabel>
              ),
            }}
          />
        </TabPanel>

        {/* Test Cases Tab - Only visible in edit mode */}
        {isEditMode && (
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Test Cases
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Create test cases to validate student submissions. Sample test cases are visible to students.
              </Typography>
              
              {testCaseError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {testCaseError}
                </Alert>
              )}
              
              {/* List existing test cases */}
              {testCases.length > 0 ? (
                <Box>
                  {testCases.map((testCase) => (
                    <TestCaseForm
                      key={testCase.id}
                      testCase={testCase}
                      onSave={() => {}}  // Update not implemented yet
                      onDelete={handleDeleteTestCase}
                    />
                  ))}
                </Box>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No test cases have been added yet.
                </Alert>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              {/* Add new test case form */}
              <Typography variant="subtitle1" gutterBottom>
                Add New Test Case
              </Typography>
              <TestCaseForm
                isNew={true}
                onSave={handleAddTestCase}
                error={testCaseError}
              />
            </Box>
          </TabPanel>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
        >
          Save Problem
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProblemForm;