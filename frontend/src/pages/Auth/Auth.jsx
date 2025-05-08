import React, { useState, useEffect } from "react";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GoogleIcon from "@mui/icons-material/Google";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AuthNavBar from "../../components/Auth_NavBar/Auth_NavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import "./Auth.css";

function Auth({ darkMode, toggleDarkMode }) {
  const [activeTab, setActiveTab] = useState(0); // 0 for login, 1 for signup
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login,
    register,
    googleAuth,
    loading,
    error: authError,
    isAuthenticated,
  } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    isTeacher: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      navigate("/home");
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (activeTab === 0) {
      // Login validation
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return false;
      }
    } else {
      // Signup validation
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill in all required fields");
        return false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return false;
      }

      // Username validation (alphanumeric, no spaces)
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(formData.username)) {
        setError("Username can only contain letters, numbers, and underscores");
        return false;
      }

      // Password validation (at least 8 characters)
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    setError("");
    setSuccess("");

    try {
      if (activeTab === 0) {
        // Login
        await login(formData.email, formData.password);
        setSuccess("Login successful!");
      } else {
        // Signup
        await register({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          is_teacher: formData.isTeacher, // Add the teacher flag
        });
        setSuccess("Account created successfully!");
        // Optionally switch to login tab after successful registration
        setActiveTab(0);
      }
    } catch (err) {
      setError(err.detail || "Authentication failed");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await googleAuth();
    } catch (err) {
      setError("Failed to initiate Google login");
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundColor: darkMode ? "#353535" : "#d9d9d9",
        minHeight: "100vh",
      }}
    >
      <AuthNavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)", // Account for navbar height
          padding: "20px",
        }}
      >
        <Card
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: "450px",
            backgroundColor: darkMode ? "#403F3F" : "#f5f5f5",
            color: darkMode ? "#d7d7d6" : "#403f3f",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              backgroundColor: darkMode ? "#353535" : "#e0e0e0",
              borderRadius: 0,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: darkMode ? "#2196f3" : "#1976d2",
                },
                "& .MuiTab-root": {
                  color: darkMode ? "#d7d7d6" : "#403f3f",
                  fontWeight: "bold",
                  "&.Mui-selected": {
                    color: darkMode ? "#2196f3" : "#1976d2",
                  },
                },
              }}
            >
              <Tab icon={<LoginIcon />} label="Login" />
              <Tab icon={<PersonAddIcon />} label="Sign Up" />
            </Tabs>
          </Paper>

          <Box
            sx={{
              padding: "24px",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              {activeTab === 0 ? "Welcome Back" : "Create Account"}
            </Typography>

            <Box sx={{ mt: 2 }}>
              {activeTab === 1 && ( // Sign up fields
                <TextField
                  fullWidth
                  required
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{
                    sx: {
                      color: darkMode ? "#82b1ff" : "#2196f3",
                      "&.Mui-focused": {
                        color: darkMode ? "#2196f3" : "#1976d2",
                      },
                    },
                  }}
                  FormHelperTextProps={{
                    sx: { color: darkMode ? "#f5f5f5" : "#555555" },
                  }}
                  InputProps={{
                    style: {
                      color: darkMode ? "#f5f5f5" : "#403f3f",
                    },
                    sx: {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: darkMode ? "#aaaaaa" : "#777777",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: darkMode ? "#2196f3" : "#1976d2",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: darkMode ? "#2196f3" : "#1976d2",
                      },
                    },
                  }}
                />
              )}

              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  sx: {
                    color: darkMode ? "#82b1ff" : "#2196f3",
                    "&.Mui-focused": {
                      color: darkMode ? "#2196f3" : "#1976d2",
                    },
                  },
                }}
                FormHelperTextProps={{
                  sx: { color: darkMode ? "#f5f5f5" : "#555555" },
                }}
                InputProps={{
                  style: {
                    color: darkMode ? "#f5f5f5" : "#403f3f",
                  },
                  sx: {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#aaaaaa" : "#777777",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#2196f3" : "#1976d2",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#2196f3" : "#1976d2",
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                required
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  sx: {
                    color: darkMode ? "#82b1ff" : "#2196f3",
                    "&.Mui-focused": {
                      color: darkMode ? "#2196f3" : "#1976d2",
                    },
                  },
                }}
                FormHelperTextProps={{
                  sx: { color: darkMode ? "#f5f5f5" : "#555555" },
                }}
                InputProps={{
                  style: {
                    color: darkMode ? "#f5f5f5" : "#403f3f",
                  },
                  sx: {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#aaaaaa" : "#777777",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#2196f3" : "#1976d2",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#2196f3" : "#1976d2",
                    },
                  },
                }}
              />

              {activeTab === 1 && ( // Additional sign up fields
                <>
                  <TextField
                    fullWidth
                    required
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      sx: {
                        color: darkMode ? "#82b1ff" : "#2196f3",
                        "&.Mui-focused": {
                          color: darkMode ? "#2196f3" : "#1976d2",
                        },
                      },
                    }}
                    FormHelperTextProps={{
                      sx: { color: darkMode ? "#f5f5f5" : "#555555" },
                    }}
                    InputProps={{
                      style: {
                        color: darkMode ? "#f5f5f5" : "#403f3f",
                      },
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#aaaaaa" : "#777777",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#2196f3" : "#1976d2",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#2196f3" : "#1976d2",
                        },
                      },
                    }}
                  />

                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{
                        sx: {
                          color: darkMode ? "#82b1ff" : "#2196f3",
                          "&.Mui-focused": {
                            color: darkMode ? "#2196f3" : "#1976d2",
                          },
                        },
                      }}
                      FormHelperTextProps={{
                        sx: { color: darkMode ? "#f5f5f5" : "#555555" },
                      }}
                      InputProps={{
                        style: {
                          color: darkMode ? "#f5f5f5" : "#403f3f",
                        },
                        sx: {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#aaaaaa" : "#777777",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#2196f3" : "#1976d2",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#2196f3" : "#1976d2",
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{
                        sx: {
                          color: darkMode ? "#82b1ff" : "#2196f3",
                          "&.Mui-focused": {
                            color: darkMode ? "#2196f3" : "#1976d2",
                          },
                        },
                      }}
                      FormHelperTextProps={{
                        sx: { color: darkMode ? "#f5f5f5" : "#555555" },
                      }}
                      InputProps={{
                        style: {
                          color: darkMode ? "#f5f5f5" : "#403f3f",
                        },
                        sx: {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#aaaaaa" : "#777777",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#2196f3" : "#1976d2",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#2196f3" : "#1976d2",
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Teacher option checkbox */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isTeacher"
                        checked={formData.isTeacher}
                        onChange={handleInputChange}
                        sx={{
                          color: darkMode ? "#82b1ff" : "#2196f3",
                          '&.Mui-checked': {
                            color: darkMode ? "#2196f3" : "#1976d2",
                          },
                        }}
                      />
                    }
                    label="Sign up as a Teacher"
                    sx={{ 
                      mt: 2,
                      color: darkMode ? "#f5f5f5" : "#403f3f",
                    }}
                  />
                  
                  {formData.isTeacher && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      You're signing up as a teacher. This will allow you to create and manage problems.
                    </Alert>
                  )}
                </>
              )}

              {/* Error and success messages */}
              {(error || authError) && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error || authError}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}

              {/* Action button */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: darkMode ? "#2196f3" : "#1976d2",
                  "&:hover": {
                    backgroundColor: darkMode ? "#1976d2" : "#1565c0",
                  },
                }}
                onClick={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeTab === 0 ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </Button>

              {/* Tab switcher */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Button
                  color="primary"
                  onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}
                >
                  {activeTab === 0
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Login"}
                </Button>
              </Box>

              <Divider sx={{ my: 2 }}>OR</Divider>

              {/* Google auth button */}
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleAuth}
                sx={{
                  borderColor: darkMode ? "#2196f3" : "#1976d2",
                  color: darkMode ? "#2196f3" : "#1976d2",
                  "&:hover": {
                    borderColor: darkMode ? "#1976d2" : "#1565c0",
                  },
                }}
                disabled={loading}
              >
                Continue with Google
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </div>
  );
}

export default Auth;
