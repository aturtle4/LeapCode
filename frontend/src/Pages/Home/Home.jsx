import React, { useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../../Components/NavBar/NavBar";
import Classrooms from "../../Components/Classrooms/Classrooms";
import SkillTree from "../../Components/SkillTree/SkillTree";
import Discussions from "../../Components/Discussions/Discussions";

function Home({ darkMode, toggleDarkMode }) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div>
      <NavBar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        selectedTab={selectedTab} 
        setSelectedTab={setSelectedTab} 
      />
      <Box
        sx={{
          height: "100vh",
          backgroundColor: darkMode ? "#353535" : "#d9d9d9",
          display: "flex",
          alignItems: "start",
          justifyContent: "start",
          position: "relative",
        }}
      >
        {selectedTab === 0 && <Classrooms darkMode={darkMode} />}
        {selectedTab === 1 && <SkillTree darkMode={darkMode} />}
        {selectedTab === 2 && <Discussions darkMode={darkMode} />}
      </Box>
    </div>
  );
}

export default Home;
