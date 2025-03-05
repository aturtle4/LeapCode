import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import StreamTab from "../../Components/Classrooms/Tabs/StreamTab";
import ClassworkTab from "../../Components/Classrooms/Tabs/ClassworkTab";
import PeopleTab from "../../Components/Classrooms/Tabs/PeopleTab";

function ClassroomPage({ darkMode, toggleDarkMode }) {
  const { id } = useParams(); // Get classroom ID from URL

  // Sample Classroom Data (Can be fetched from API later)
  const classrooms = [
    { title: "Classroom 1", teacher: "Prof. Noel Tiju", bgColor: "#e67e22", classroomID: "A1" },
    { title: "Classroom 2", teacher: "Prof. Johnson", bgColor: "#3498db", classroomID: "A2" },
    { title: "Classroom 3", teacher: "Prof. Davis", bgColor: "#2ecc71", classroomID: "A3" },
    { title: "Classroom 4", teacher: "Prof. Wilson", bgColor: "#9b59b6", classroomID: "A4" },
    { title: "Classroom 5", teacher: "Prof. Brown", bgColor: "#f39c12", classroomID: "A5" },
  ];
  
  const classroom = classrooms.find((c) => c.classroomID === id);
  // State for Tabs
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle Invalid Classroom ID
  if (!classroom) {
    return (
      <Typography variant="h4" sx={{ textAlign: "center", mt: 5 }}>
        Classroom Not Found
      </Typography>
    );
  }

  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#353535" : "#d9d9d9",
        color: darkMode ? "#fff" : "#000",
        padding: "20px",
      }}
    >
      {/* Header Section */}
      <Paper
        sx={{
          padding: "20px",
          borderRadius: 2,
          backgroundColor: classroom.bgColor,
          boxShadow: darkMode ? "0px 4px 10px rgba(255, 255, 255, 0.1)" : "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {classroom.title}
        </Typography>
        <Typography variant="h6">Instructor: {classroom.teacher}</Typography>
        <Typography variant="body1">Classroom ID: {classroom.classroomID}</Typography>
      </Paper>

      <Paper
        sx={{
          marginTop: "20px",
          borderRadius: 2,
          backgroundColor: darkMode ? "#353535" : "#d9d9d9"
        //   boxShadow: darkMode ? "0px 4px 10px rgba(255, 255, 255, 0.1)" : "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="primary"
          centered
          sx={{
            backgroundColor: darkMode ? "#353535" : "#d9d9d9",
            color: darkMode ? "#d7d7d6" : "#403f3f",
          }}
        >
          <Tab label="Stream" />
          <Tab label="Classwork" />
          <Tab label="People" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ padding: "20px" }}>
          {tabValue === 0 && <StreamTab darkMode={darkMode} />}
          {tabValue === 1 && <ClassworkTab darkMode={darkMode} />}
          {tabValue === 2 && <PeopleTab darkMode={darkMode} />}
        </Box>
      </Paper>
    </Box>
  );
}

export default ClassroomPage;
