import React from "react";
import { Box } from "@mui/material";
import NavBar from "../../components/NavBar/NavBar";
import SkillTreeHome from "../../components/SkillTree/SkillTreeHome";

function Home({ darkMode, toggleDarkMode }) {
  return (
    <div>
      <NavBar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        currentPage="skillTree"
      />
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)", // Adjust for navbar height
          backgroundColor: darkMode ? "#353535" : "#d9d9d9",
          display: "flex",
          flex: 1,
          alignItems: "start",
          justifyContent: "start",
          position: "relative",
        }}
      >
        <SkillTreeHome darkMode={darkMode} />
      </Box>
    </div>
  );
}

export default Home;
