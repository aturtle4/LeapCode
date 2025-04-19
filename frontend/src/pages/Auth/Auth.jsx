import React, { useState, useEffect } from "react";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InfoIcon from "@mui/icons-material/Info";
import GoogleIcon from "@mui/icons-material/Google";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import Auth_NavBar from "../../components/Auth_NavBar/Auth_NavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import "./Auth.css";

function Auth({ darkMode, toggleDarkMode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setSelectedTab(isLogin ? 2 : 1);
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return false;
      }
    } else {
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
      if (isLogin) {
        await login(formData.email, formData.password);
        setSuccess("Login successful!");
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        setSuccess("Account created successfully!");
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
    <div>
      <Auth_NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Box
        sx={{
          height: "100vh",
          backgroundColor: darkMode ? "#353535" : "#d9d9d9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Card
          sx={{
            width: "900px",
            height: !isLogin ? "500px" : "400px", // Make card taller for signup
            backgroundColor: darkMode ? "#403F3F" : "#d9d9d9",
            color: darkMode ? "#d7d7d6" : "#403f3f",
            display: "flex",
            alignItems: "start",
            justifyContent: "end",
            padding: "20px",
            boxShadow: 3,
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "100px",
              height: "400px",
              backgroundColor: darkMode ? "#403F3F" : "#d9d9d9",
              color: darkMode ? "#d7d7d6" : "#403f3f",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-465%, -50%)",
            }}
          >
            <Tabs
              orientation="vertical"
              value={selectedTab}
              onChange={(e, newValue) => {
                setSelectedTab(newValue);
                setIsLogin(newValue === 1);
              }}
              sx={{
                flexGrow: 1,
                width: "100%",
                height: "100%",
                "& .MuiTabs-indicator": {
                  backgroundColor: darkMode ? "#d7d7d6" : "#403f3f",
                },
                "& .MuiTab-root": {
                  width: "100%",
                  color: darkMode ? "#d7d7d6" : "#403f3f",
                  justifyContent: "flex-center",
                  alignItems: "center",
                  padding: "50px",
                },
              }}
            >
              <Tab
                icon={
                  <InfoIcon
                    fontSize="large"
                    sx={{ color: darkMode ? "#d7d7d6" : "#403f3f" }}
                  />
                }
                disabled
              />
              <Tab
                icon={
                  <LoginIcon
                    fontSize="large"
                    sx={{ color: darkMode ? "#d7d7d6" : "#403f3f" }}
                  />
                }
              />
              <Tab
                icon={
                  <PersonAddIcon
                    fontSize="large"
                    sx={{ color: darkMode ? "#d7d7d6" : "#403f3f" }}
                  />
                }
              />
            </Tabs>
          </Box>
          <Box
            sx={{
              width: "350px",
              height: !isLogin ? "480px" : "400px", // Make box taller for signup
              backgroundColor: darkMode ? "#403F3F" : "#d9d9d9",
              color: darkMode ? "#d7d7d6" : "#403f3f",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(20%, -50%)",
              overflow: !isLogin ? "auto" : "visible", // Add scroll for signup form
              paddingRight: "8px",
            }}
          >
            <Typography variant="h4">{isLogin ? "Login" : "SignUp"}</Typography>
            {!isLogin && (
              <TextField
                fullWidth
                required
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="dense"
                variant="outlined"
                InputLabelProps={{
                  style: { color: darkMode ? "#d9d9d9" : "#403F3F" },
                }}
                InputProps={{
                  style: {
                    color: darkMode ? "#d7d7d6" : "#403f3f",
                    backgroundColor: darkMode ? "#403f3f" : "#d9d9d9",
                  },
                  sx: {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#d7d6d6" : "#403f3f",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#ffffff" : "#000000",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#ff9800" : "#1976d2",
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
              value={formData.email}
              onChange={handleInputChange}
              margin={isLogin ? "normal" : "dense"}
              variant="outlined"
              InputLabelProps={{
                style: { color: darkMode ? "#d9d9d9" : "#403F3F" },
              }}
              InputProps={{
                style: {
                  color: darkMode ? "#d7d7d6" : "#403f3f",
                  backgroundColor: darkMode ? "#403f3f" : "#d9d9d9",
                },
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#d7d6d6" : "#403f3f",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#ffffff" : "#000000",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#ff9800" : "#1976d2",
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
              margin={isLogin ? "normal" : "dense"}
              variant="outlined"
              InputLabelProps={{
                style: { color: darkMode ? "#d9d9d9" : "#403F3F" },
              }}
              InputProps={{
                style: {
                  color: darkMode ? "#d7d7d6" : "#403f3f",
                  backgroundColor: darkMode ? "#403f3f" : "#d9d9d9",
                },
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#d7d6d6" : "#403f3f",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#ffffff" : "#000000",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#ff9800" : "#1976d2",
                  },
                },
              }}
            />
            {!isLogin && (
              <>
                <TextField
                  fullWidth
                  required
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{
                    style: { color: darkMode ? "#d9d9d9" : "#403F3F" },
                  }}
                  InputProps={{
                    style: {
                      color: darkMode ? "#d7d7d6" : "#403f3f",
                      backgroundColor: darkMode ? "#403f3f" : "#d9d9d9",
                    },
                    sx: {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: darkMode ? "#d7d6d6" : "#403f3f",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: darkMode ? "#ffffff" : "#000000",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: darkMode ? "#ff9800" : "#1976d2",
                      },
                    },
                  }}
                />

                <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    margin="dense"
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: darkMode ? "#d9d9d9" : "#403F3F" },
                    }}
                    InputProps={{
                      style: {
                        color: darkMode ? "#d7d7d6" : "#403f3f",
                        backgroundColor: darkMode ? "#403f3f" : "#d9d9d9",
                      },
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#d7d6d6" : "#403f3f",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#ffffff" : "#000000",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#ff9800" : "#1976d2",
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
                    margin="dense"
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: darkMode ? "#d9d9d9" : "#403F3F" },
                    }}
                    InputProps={{
                      style: {
                        color: darkMode ? "#d7d7d6" : "#403f3f",
                        backgroundColor: darkMode ? "#403f3f" : "#d9d9d9",
                      },
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#d7d6d6" : "#403f3f",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#ffffff" : "#000000",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#ff9800" : "#1976d2",
                        },
                      },
                    }}
                  />
                </Box>
              </>
            )}

            {/* Error and success message display */}
            {error && (
              <Alert severity="error" sx={{ mt: 1, width: "100%" }}>
                {error}
              </Alert>
            )}

            {authError && (
              <Alert severity="error" sx={{ mt: 1, width: "100%" }}>
                {authError}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 1, width: "100%" }}>
                {success}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: "20px" }}
              onClick={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </Button>

            <Divider
              sx={{
                width: "100%",
                my: 2,
                color: darkMode ? "#d7d7d6" : "#403f3f",
                "&::before, &::after": {
                  borderColor: darkMode ? "#d7d7d6" : "#403f3f",
                },
              }}
            >
              OR
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleAuth}
              sx={{ mb: 2 }}
              disabled={loading}
            >
              Continue with Google
            </Button>
          </Box>
        </Card>

        <Card
          sx={{
            width: "400px",
            height: !isLogin ? "550px" : "550px",
            backgroundColor: darkMode ? "#403F3F" : "#d9d9d9",
            color: darkMode ? "#d7d7d6" : "#403f3f",
            display: "flex",
            alignItems: "end",
            justifyContent: "center",
            boxShadow: 6,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-89%, -50%)",
            zIndex: 10,
          }}
        >
          <Button variant="Contained" onClick={toggleForm}>
            {isLogin
              ? "Don't have an Account? Signup"
              : "Already have an Account? Login"}
          </Button>
        </Card>
      </Box>
    </div>
  );
}

export default Auth;
