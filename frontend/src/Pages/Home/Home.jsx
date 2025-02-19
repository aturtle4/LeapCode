import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import NavBar from "../../Components/NavBar/NavBar";

function Home({ darkMode, toggleDarkMode }) {
  const [selectedTab, setSelectedTab] = useState(0); // Store selected tab

  return (
    <div>
      <NavBar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        selectedTab={selectedTab} 
        setSelectedTab={setSelectedTab} // Pass state setter
      />
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
        {selectedTab === 0 && <Typography variant="h4">Classrooms Content</Typography>}
        {selectedTab === 1 && <Typography variant="h4">SkillTree Content</Typography>}
        {selectedTab === 2 && <Typography variant="h4">Discussions Content</Typography>}
      </Box>
    </div>
  );
}

export default Home;
