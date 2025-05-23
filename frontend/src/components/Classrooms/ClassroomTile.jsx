import React from "react";
import { Card, CardActionArea, Typography, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {useNavigate} from "react-router-dom";

function ClassroomTile({ darkMode, title, teacher, bgColor, classroomID }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/classroom/${classroomID}`, {
      state: { title, teacher, bgColor, darkMode, classroomID },
    });
  };

  return (
    <Card
      sx={{
        width: 300,
        borderRadius: 5,
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
      <CardActionArea onClick={handleClick}>
        {/* Top Section */}
        <Box
          sx={{
            height: 80,
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
            height: 100,
            backgroundColor: darkMode ? "#424242" : "#f0f0f0",
          }}
        />
      </CardActionArea>
    </Card>
  );
}

export default ClassroomTile;
