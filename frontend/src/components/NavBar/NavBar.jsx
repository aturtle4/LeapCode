import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

function NavBar({ darkMode, toggleDarkMode, selectedTab, setSelectedTab }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: darkMode ? "#353535" : "#d9d9d9",
        color: darkMode ? "#d7d7d6" : "#403f3f",
        transition: "all 0.3s ease",
        padding: "5px 0",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h3">LeapCode</Typography>

        {/* Tabs Section */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Tabs
            value={selectedTab} // Controlled component
            onChange={(event, newValue) => setSelectedTab(newValue)} // Update state in Home
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              "& .MuiTab-root": {
                fontSize: "1.2rem",
                fontWeight: 500,
                padding: "12px 35px",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                color: darkMode ? "#d7d7d6" : "#403f3f",
                "&:hover": {
                  backgroundColor: darkMode ? "#4a4a4a" : "#e0e0e0",
                },
                "&.Mui-selected": {
                  fontWeight: "bold",
                  backgroundColor: darkMode ? "#353535" : "#d9d9d9",
                },
              },
            }}
          >
            <Tab label="Classrooms" />
            <Tab label="SkillTree" />
            <Tab label="Discussions" />
          </Tabs>
        </Box>

        {/* Profile Section */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <AccountCircle fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              mt: 1,
              "& .MuiPaper-root": {
                backgroundColor: darkMode ? "#454545" : "#f0f0f0",
                color: darkMode ? "#d7d7d6" : "#403f3f",
                transition: "all 0.3s ease",
              },
            }}
          >
            <MenuItem sx={{ "&:hover": { backgroundColor: darkMode ? "#555" : "#ddd" } }}>
              Profile
            </MenuItem>
            <MenuItem sx={{ "&:hover": { backgroundColor: darkMode ? "#555" : "#ddd" } }}>
              Settings
            </MenuItem>
            <MenuItem
              sx={{
                "&:hover": { backgroundColor: darkMode ? "#ff4d4d" : "#ff9999", color: "#fff" },
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
