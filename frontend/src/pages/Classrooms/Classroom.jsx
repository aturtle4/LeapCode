import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Tabs, Tab, Paper, IconButton } from "@mui/material";
import { ArrowBack, AccountCircle } from "@mui/icons-material";
import StreamTab from "../../components/Classrooms/Tabs/StreamTab";
import ClassworkTab from "../../components/Classrooms/Tabs/ClassworkTab";
import PeopleTab from "../../components/Classrooms/Tabs/PeopleTab";

function ClassroomPage({ darkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const classrooms = [
    { title: "Classroom 1", teacher: "Professor", bgColor: "#e74c3c", classroomID: "A1" },
    { title: "Classroom 2", teacher: "Professor", bgColor: "#3498db", classroomID: "A2" },
    { title: "Classroom 3", teacher: "Professor", bgColor: "#2ecc71", classroomID: "A3" },
    { title: "Classroom 4", teacher: "Prof. Wilson", bgColor: "#9b59b6", classroomID : "A4" },
    { title: "Classroom 5", teacher: "Prof. Brown", bgColor: "#f39c12", classroomID : "A5" },
  ];

  const classroom = classrooms.find((c) => c.classroomID === id);
  const [tabValue, setTabValue] = useState(0);

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
        color: darkMode ? "#d7d7d6" : "#403f3f",
        padding: "20px",
      }}
    >
      {/* Header Section */}
      <Paper
        sx={{
          padding: "20px",
          borderRadius: "20px",
          backgroundColor: classroom.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={() => navigate("/home")} sx={{ color: "d7d7d6" }}>
          <ArrowBack fontSize="large" />
        </IconButton>
        <Box sx={{ textAlign: "center", flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold" color="d7d7d6">
            {classroom.title}
          </Typography>
          <Typography variant="body1" color="d7d7d6">
            {classroom.teacher}
          </Typography>
        </Box>
        <IconButton sx={{ color: "d7d7d6" }}>
          <AccountCircle fontSize="large" />
        </IconButton>
      </Paper>

      {/* Tabs Section */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        indicatorColor="secondary"
        textColor="inherit"
        centered
        sx={{ marginTop: "20px", color: darkMode ? "#d7d7d6" : "#403f3f", "& .MuiTabs-indicator": {backgroundColor : "7F7CAF" }}}
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
    </Box>
  );
}

export default ClassroomPage;