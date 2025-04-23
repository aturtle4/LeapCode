import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import CodeIcon from "@mui/icons-material/Code";
import { Box } from "@mui/material";

function AuthNavBar({ darkMode, toggleDarkMode }) {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: darkMode ? "#353535" : "#d9d9d9",
        color: darkMode ? "#d7d7d6" : "#403f3f",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CodeIcon
            sx={{
              mr: 1,
              fontSize: "1.5rem",
              color: darkMode ? "#82b1ff" : "#1976d2",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.5px",
              fontFamily: "'Roboto Condensed', 'Roboto', sans-serif",
              background: "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: darkMode ? "0px 1px 2px rgba(0,0,0,0.3)" : "none",
            }}
          >
            LeapCode
          </Typography>
        </Box>
        <IconButton onClick={toggleDarkMode} color="inherit">
          {darkMode ? (
            <DarkMode fontSize="large" />
          ) : (
            <LightMode fontSize="large" />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default AuthNavBar;
