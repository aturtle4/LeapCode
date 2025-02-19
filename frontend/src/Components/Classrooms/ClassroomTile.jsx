import React from "react";
import { Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function ClassroomTile({ darkMode, title, teacher, bgColor }) {
  return (
    <Card
      sx={{
        width: 300,
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: darkMode ? "#333" : "#fff",
        boxShadow: 3,
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea>
        {/* Top Section */}
        <Box
          sx={{
            height: 100,
            backgroundColor: bgColor || "#e67e22",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 15px",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="body2">{teacher}</Typography>
          </Box>
          <AccountCircleIcon sx={{ fontSize: 50, opacity:  1.0 }} />
        </Box>

        {/* Bottom Section */}
        <Box
          sx={{
            height: 120,
            backgroundColor: darkMode ? "#424242" : "#f0f0f0",
          }}
        />
      </CardActionArea>
    </Card>
  );
}

export default ClassroomTile;
