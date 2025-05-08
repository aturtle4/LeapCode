import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Button,
} from "@mui/material";
import {
  AccountCircle,
  Brightness4,
  Brightness7,
  Code as CodeIcon,
  Assignment,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function NavBar({ darkMode, toggleDarkMode }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: darkMode ? "#353535" : "#d9d9d9",
        color: darkMode ? "#d7d7d6" : "#403f3f",
        transition: "all 0.3s ease",
        borderBottom: `1px solid ${darkMode ? "#444444" : "#e0e0e0"}`,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo Section */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
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

        {/* Center Section - Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
          {/* Only show Problems link to teachers */}
          {user?.is_teacher && (
            <Button
              startIcon={<Assignment />}
              onClick={() => navigate("/problems")}
              sx={{ 
                color: darkMode ? "#d7d7d6" : "#555555",
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                }
              }}
            >
              Problems
            </Button>
          )}
          
          <Typography
            variant="h6"
            sx={{
              color: darkMode ? "#d7d7d6" : "#555555",
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            {user?.first_name
              ? `Welcome, ${user.first_name}!`
              : "Welcome to your learning journey"}
          </Typography>
        </Box>

        {/* Right Section - User & Theme */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Theme Toggle */}
          <Tooltip
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                color: darkMode ? "#2196f3" : "#1976d2",
                marginRight: 2,
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {/* User Profile */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              color: darkMode ? "#d7d7d6" : "#555555",
              backgroundColor: darkMode
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
              padding: "8px",
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
              },
            }}
          >
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                }}
              />
            ) : (
              <AccountCircle fontSize="large" />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              mt: 1,
              "& .MuiPaper-root": {
                backgroundColor: darkMode ? "#383838" : "#ffffff",
                color: darkMode ? "#d7d7d6" : "#333333",
                borderRadius: "8px",
                boxShadow: darkMode
                  ? "0 4px 20px rgba(0,0,0,0.5)"
                  : "0 4px 20px rgba(0,0,0,0.1)",
                overflow: "hidden",
                padding: "5px",
              },
            }}
          >
            <MenuItem
              sx={{
                borderRadius: "4px",
                margin: "2px 0",
                padding: "10px 15px",
                "&:hover": {
                  backgroundColor: darkMode ? "#444444" : "#f5f5f5",
                },
              }}
            >
              Profile
            </MenuItem>
            {/* Only show Problems menu item to teachers */}
            {user?.is_teacher && (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/problems");
                }}
                sx={{
                  borderRadius: "4px",
                  margin: "2px 0",
                  padding: "10px 15px",
                  "&:hover": {
                    backgroundColor: darkMode ? "#444444" : "#f5f5f5",
                  },
                }}
              >
                Manage Problems
              </MenuItem>
            )}
            <MenuItem
              sx={{
                borderRadius: "4px",
                margin: "2px 0",
                padding: "10px 15px",
                "&:hover": {
                  backgroundColor: darkMode ? "#444444" : "#f5f5f5",
                },
              }}
            >
              Settings
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                borderRadius: "4px",
                margin: "2px 0",
                padding: "10px 15px",
                color: "#f44336",
                "&:hover": {
                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                },
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
