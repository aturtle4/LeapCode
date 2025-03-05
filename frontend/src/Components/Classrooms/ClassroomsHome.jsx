import React from "react";
import ClassroomTile from "./ClassroomTile";
import { Box, Container } from "@mui/material";

function ClassroomsHome({ darkMode }) {
  const classrooms = [
    { title: "Classroom 1", teacher: "Prof. Noel Tiju", bgColor: "#e67e22", classroomID : "A1" },
    { title: "Classroom 2", teacher: "Prof. Johnson", bgColor: "#3498db", classroomID : "A2" },
    { title: "Classroom 3", teacher: "Prof. Davis", bgColor: "#2ecc71", classroomID : "A3" },
    { title: "Classroom 4", teacher: "Prof. Wilson", bgColor: "#9b59b6", classroomID : "A4" },
    { title: "Classroom 5", teacher: "Prof. Brown", bgColor: "#f39c12", classroomID : "A5" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#353535" : "#d9d9d9",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        padding: "70px 125px",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
            justifyContent: "start",
          }}
        >
          {classrooms.map((classroom, index) => (
            <Box key={index} sx={{ flex: "1 1 300px", maxWidth: "300px" }}>
              <ClassroomTile darkMode={darkMode} {...classroom} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default ClassroomsHome;
