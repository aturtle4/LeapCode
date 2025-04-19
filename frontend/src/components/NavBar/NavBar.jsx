import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  Tooltip,
} from "@mui/material";
import {
  AccountCircle,
  Brightness4,
  Brightness7,
  BarChart,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function NavBar({ darkMode, toggleDarkMode, currentPage }) {
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
        backgroundColor: darkMode ? "#2c2c2c" : "#f5f5f5",
        color: darkMode ? "#ffffff" : "#333333",
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
          <Typography
            variant="h4"
            sx={{
              fontWeight: "700",
              background: "linear-gradient(90deg, #3498db, #2ecc71)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "1px",
            }}
          >
            LeapCode
          </Typography>
        </Box>

        {/* Center Section - Main Navigation */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            startIcon={<BarChart />}
            onClick={() => navigate("/home")}
            variant={currentPage === "skillTree" ? "contained" : "text"}
            sx={{
              mx: 1,
              px: 3,
              py: 1,
              borderRadius: "8px",
              backgroundColor:
                currentPage === "skillTree" &&
                (darkMode ? "#1976d2" : "#2196f3"),
              color:
                currentPage === "skillTree"
                  ? "#ffffff"
                  : darkMode
                  ? "#d7d7d6"
                  : "#555555",
              "&:hover": {
                backgroundColor:
                  currentPage === "skillTree"
                    ? darkMode
                      ? "#1565c0"
                      : "#1976d2"
                    : darkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
              },
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            Skill Trees
          </Button>
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
                color: darkMode ? "#ffd54f" : "#9e9e9e",
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
