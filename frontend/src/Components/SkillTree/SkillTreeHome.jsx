import React from "react";
import { Box, Typography, Avatar, CircularProgress, Grid, Paper } from "@mui/material";
import { Person } from "@mui/icons-material";

function SkillTreeHome({ darkMode }) {
  const skillTrees = [
    { skilTreeID: "ST1", title: "OOPs Fundamentals", bgColor: "#e74c3c", guide: "", percentageCompleted: 59, nextDeadline: "" },
    { skilTreeID: "ST2", title: "Design Patterns: 101", bgColor: "#f39c12", guide: "Dr. Noel Tiju", percentageCompleted: 10, nextDeadline: "10 March" },
    { skilTreeID: "ST3", title: "Data Structures Mastery", bgColor: "#3498db", guide: "", percentageCompleted: 35, nextDeadline: "" },
    { skilTreeID: "ST4", title: "Competitive Programming Essentials", bgColor: "#2ecc71", guide: "Prof. Daniel", percentageCompleted: 20, nextDeadline: "15 March" },
    { skilTreeID: "ST5", title: "SQL & Databases", bgColor: "#9b59b6", guide: "", percentageCompleted: 75, nextDeadline: "" },
    { skilTreeID: "ST6", title: "Algorithm Explorer", bgColor: "#f39c12", guide: "Dr. Smith", percentageCompleted: 50, nextDeadline: "22 March" },
  ];

  return (
    <Box
      sx={{
        padding: "70px 125px",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#353535" : "#d9d9d9",
      }}
    >
      <Grid container spacing={4}>
        {skillTrees.map((tree) => (
          <Grid item xs={12} sm={6} md={4} key={tree.skilTreeID}>
            <Paper
              elevation={6}
              sx={{
                borderRadius: "15px",
                overflow: "hidden",
                backgroundColor: darkMode ? "#353535" : "#d9d9d9",
                color: darkMode ? "#d7d7d6" : "#403f3f",
                display: "flex",
                flexDirection: "column",
                height: "200px",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              {/* Top Section (Title & Guide) */}
              <Box
                sx={{
                  backgroundColor: tree.bgColor,
                  padding: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {tree.title}
                  </Typography>
                  {tree.guide && (
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {tree.guide}
                    </Typography>
                  )}
                </Box>

                {/* Show Avatar only if private (i.e., has a guide) */}
                {tree.guide && (
                  <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.3)" }}>
                    <Person />
                  </Avatar>
                )}
              </Box>

              {/* Bottom Section (Deadline & Progress) */}
              <Box
                sx={{
                  padding: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                {/* Next Deadline (only for private trees) */}
                {tree.nextDeadline ? (
                  <Typography variant="body2" color="red">
                    Next Deadline: {tree.nextDeadline}
                  </Typography>
                ) : (
                  <Box sx={{ width: "50px" }} /> // Empty space for alignment
                )}

                {/* Circular Progress (Aligned to Right) */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CircularProgress
                    variant="determinate"
                    value={tree.percentageCompleted}
                    size={50}
                    thickness={5}
                    sx={{ color: tree.bgColor }}
                  />
                  <Typography variant="h6">{tree.percentageCompleted}%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SkillTreeHome;
