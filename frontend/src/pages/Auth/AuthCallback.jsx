import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract tokens from URL parameters
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("token");
    const refreshToken = params.get("refresh_token");

    if (accessToken) {
      // Store the tokens in localStorage
      localStorage.setItem("access_token", accessToken);

      // Store refresh token if available
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      // Redirect to home page
      navigate("/home");
    } else {
      // If no token found, redirect to login page
      navigate("/auth");
    }
  }, [location, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Completing authentication...
      </Typography>
    </Box>
  );
}

export default AuthCallback;
