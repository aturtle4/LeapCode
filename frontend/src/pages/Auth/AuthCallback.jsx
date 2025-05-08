import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import TeacherConfirmationDialog from "../../components/Auth/TeacherConfirmationDialog";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [tokens, setTokens] = useState({ accessToken: null, refreshToken: null });
  const [isNewUser, setIsNewUser] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Process tokens and check if this is a new user
  useEffect(() => {
    const processAuth = async () => {
      try {
        // Extract tokens from URL parameters
        const params = new URLSearchParams(location.search);
        const accessToken = params.get("token");
        const refreshToken = params.get("refresh_token");
        const isNew = params.get("is_new_user") === "true";

        if (accessToken) {
          setTokens({
            accessToken,
            refreshToken: refreshToken || null
          });
          
          // Store the tokens in localStorage
          localStorage.setItem("access_token", accessToken);
          if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
          }

          // If this is a new user from Google auth, show the teacher dialog
          if (isNew) {
            setIsNewUser(true);
            setShowTeacherDialog(true);
            setLoading(false);
          } else {
            // Existing user, redirect to home
            navigate("/home");
          }
        } else {
          // If no token found, redirect to login page
          setError("Authentication failed");
          setTimeout(() => navigate("/auth"), 2000);
        }
      } catch (err) {
        setError("Error processing authentication");
        setTimeout(() => navigate("/auth"), 2000);
      }
    };

    processAuth();
  }, [location, navigate]);

  // Handle user's teacher/student choice
  const handleTeacherChoice = async (isTeacher) => {
    try {
      setLoading(true);
      console.log(`Teacher option selected: ${isTeacher}`);
      console.log(`Using access token: ${tokens.accessToken?.substring(0, 10)}...`);
      
      if (isTeacher) {
        const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/v1/auth/update-role`;
        console.log(`Making API call to: ${apiUrl}`);
        
        // Update user role to teacher
        const response = await axios.post(
          apiUrl,
          { is_teacher: true },
          {
            headers: { 
              Authorization: `Bearer ${tokens.accessToken}` 
            }
          }
        );
        
        console.log("Role update response:", response.data);
        
        // Force reload user data to get updated teacher status
        await loadUser();
      }
      
      // Close dialog and navigate to home
      setShowTeacherDialog(false);
      navigate("/home");
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role");
      // Still navigate to home even if role update fails
      setTimeout(() => navigate("/home"), 2000);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#353535" : "#d9d9d9",
      }}
    >
      {loading && !showTeacherDialog && (
        <>
          <CircularProgress size={60} sx={{ color: darkMode ? "#2196f3" : "#1976d2" }} />
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 2,
              color: darkMode ? "#d7d7d6" : "#403f3f",
            }}
          >
            Completing authentication...
          </Typography>
        </>
      )}

      {error && (
        <Typography 
          variant="h6" 
          color="error" 
          sx={{ mt: 2 }}
        >
          {error}
        </Typography>
      )}

      {/* Teacher role confirmation dialog */}
      <TeacherConfirmationDialog
        open={showTeacherDialog}
        onClose={handleTeacherChoice}
        onConfirm={handleTeacherChoice}
        darkMode={darkMode}
      />
    </Box>
  );
}

export default AuthCallback;
