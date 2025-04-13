import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";

function Auth_NavBar({ darkMode, toggleDarkMode }) {
  return (
    <AppBar 
      position="static" 
      sx={{ backgroundColor: darkMode ? "#353535" : "#d9d9d9", color: darkMode ? "#d7d7d6" : "#403f3f" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h3">LeapCode</Typography>
        <IconButton onClick={toggleDarkMode} color="inherit">
          {darkMode ? <DarkMode fontSize="large"/> : <LightMode fontSize="large"/>}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Auth_NavBar;
