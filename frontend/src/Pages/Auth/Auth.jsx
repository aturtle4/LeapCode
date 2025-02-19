import React, { useState } from "react";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Card, TextField, Typography, Button, Tabs, Tab } from "@mui/material";
import Auth_NavBar from "../../Components/Auth_NavBar/Auth_NavBar";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth({darkMode, toggleDarkMode}) {
  
  const [isLogin, setIsLogin] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);
  const navigate = useNavigate();

  
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setSelectedTab(isLogin ? 2 : 1);
  };
  const handleAuth = () => {
    // Add authentication logic here (e.g., form validation, API call)
    navigate("/home"); // Redirect user to /home after login/signup
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
            height: "400px",
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
                <Tab icon={<InfoIcon fontSize="large" sx={{ color: darkMode ? "#d7d7d6" : "#403f3f" }} />} disabled/>
                <Tab icon={<LoginIcon fontSize="large" sx={{ color: darkMode ? "#d7d7d6" : "#403f3f" }} />} />
                <Tab icon={<PersonAddIcon fontSize="large" sx={{ color: darkMode ? "#d7d7d6" : "#403f3f" }} />} />
                </Tabs> 
            </Box>
          <Box
          sx={{
            width: "350px",
            height: "400px",
            backgroundColor: darkMode ? "#403F3F" : "#d9d9d9",
            color: darkMode ? "#d7d7d6" : "#403f3f",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(20%, -50%)",
          }}
        >
            <Typography variant="h4" >{isLogin ? 'Login' : 'SignUp'}</Typography>
            {!isLogin && (
                <TextField
                  fullWidth
                  required
                  label="Username"
                  margin= "dense"
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
            margin={isLogin ? "normal" : "dense"}
            variant="outlined"
            InputLabelProps={{ style: { color: darkMode ? "#d9d9d9" : "#403F3F" } }}
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
            margin={isLogin ? "normal" : "dense"}
            variant="outlined"
            InputLabelProps={{ style: { color: darkMode ? "#d9d9d9" : "#403F3F" } }}
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
                <TextField
                  fullWidth
                  required
                  label="Confirm Password"
                  type="password"
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
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ marginTop: "20px" }}
                onClick={handleAuth}
              >
                {isLogin ? "Login" : "Sign Up"}
              </Button>
        </Box>
        </Card>

        <Card
          sx={{
            width: "400px",
            height: "550px",
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
            {isLogin ? "Don't have an Account? Singup" : "Already have an Account? Login"}
          </Button>
        </Card>
      </Box>
    </div>
  );
}

export default Auth;
