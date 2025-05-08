import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  Alert
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';

const TestCaseForm = ({ 
  testCase, 
  onSave, 
  onDelete, 
  isNew = false, 
  error = null 
}) => {
  const [formData, setFormData] = useState({
    input_data: testCase?.input_data || '',
    expected_output: testCase?.expected_output || '',
    is_sample: testCase?.is_sample || true,
    weight: testCase?.weight || 1
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Typography variant="subtitle1" gutterBottom>
            {isNew ? "New Test Case" : `Test Case ${testCase?.id?.substring(0, 8)}`}
          </Typography>
          
          <TextField
            label="Input"
            name="input_data"
            value={formData.input_data}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            margin="normal"
            placeholder="Enter test case input data"
            helperText="Enter input exactly as it would be provided to the program"
          />
          
          <TextField
            label="Expected Output"
            name="expected_output"
            value={formData.expected_output}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            margin="normal"
            placeholder="Enter expected output"
            helperText="Enter output exactly as it should be returned by the program"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  name="is_sample"
                  checked={formData.is_sample}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Visible to students"
            />
            
            <TextField
              label="Weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              InputProps={{
                inputProps: { min: 1 },
                startAdornment: <InputAdornment position="start">Points:</InputAdornment>,
              }}
              sx={{ width: '150px' }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {!isNew && (
              <Button
                startIcon={<Delete />}
                color="error"
                onClick={() => onDelete(testCase.id)}
                sx={{ mr: 1 }}
              >
                Delete
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={isNew ? <Add /> : null}
            >
              {isNew ? "Add Test Case" : "Update"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestCaseForm;