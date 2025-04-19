import React, { useState } from "react";
import { Box, Typography, IconButton, Button, Tabs, Tab } from "@mui/material";
import { ArrowBack, PlayArrow, CheckCircle, AccountCircle } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import ProblemToolKit from '../../components/PracticeProblem/ProblemToolKit';
import ProblemRightDraggableArea from "../../components/PracticeProblem/ProblemRightDraggableArea";
import { DndContext } from '@dnd-kit/core';

function PracticeProblem({ darkMode }) {
  const navigate = useNavigate();
  const { problemid, problemName } = useParams();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };
  const [droppedBlocks, setDroppedBlocks] = useState([]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    // Make sure the drop target is valid
    if (over && over.id === 'droppable-area') {
      const newBlock = {
        id: `${active.id}-${Date.now()}`, // unique ID for each block
        label: active.data?.current?.label || active.id, // get the label from the active item
      };
      
      // Append the new block to the dropped blocks array
      setDroppedBlocks((prevBlocks) => [...prevBlocks, newBlock]);
    }
  };
  

  return (
    <DndContext onDragEnd={handleDragEnd}>
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#353535" : "#d9d9d9",
        p: 2,
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          backgroundColor: darkMode ? "#353535" : "#ffffff",
          color: darkMode ? "#d7d7d6" : "#403f3f",
          padding: "15px",
          borderRadius: "15px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack sx={{ color: darkMode ? "#d7d7d6" : "#403f3f" }} />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            {`Problem List > ${problemName}`}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PlayArrow />}
            sx={{
              color: darkMode ? "#d7d7d6" : "#403f3f",
              borderColor: "#888",
              "&:hover": { borderColor: "#7B61FF", backgroundColor: "#2c2c2c" },
            }}
          >
            Run
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{
              backgroundColor: "#7B61FF",
              color: "white",
              "&:hover": { backgroundColor: "#9e82ff" },
            }}
          >
            Submit
          </Button>
        </Box>
        <IconButton>
          <AccountCircle sx={{ color: "#aaa" }} />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: "flex", height: "calc(100vh - 140px)", gap: 2 }}>
        {/* Left Component */}
        <Box
          sx={{
            width: "30%",
            height: "100%",
            backgroundColor: darkMode ? "#353535" : "#ffffff",
            color: darkMode ? "#d7d7d6" : "#403f3f",
            borderRadius: "15px",
            overflow: "hidden",
            transition: "transform 0.2s ease-in-out",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          <Box sx={{ borderBottom: "1px solid #333" }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="inherit"
              TabIndicatorProps={{ style: { background: "#7B61FF" } }}
            >
              <Tab label="Description" sx={{
                color: tabIndex === 0 ? "#7B61FF" : (darkMode ? "#d7d7d6" : "#403f3f"),
                backgroundColor: tabIndex === 0 ? "rgba(123, 97, 255, 0.1)" : "transparent",
                "&:hover": { backgroundColor: "rgba(123, 97, 255, 0.2)" },
              }} />
              <Tab label="Submissions" sx={{
                color: tabIndex === 1 ? "#7B61FF" : (darkMode ? "#d7d7d6" : "#403f3f"),
                backgroundColor: tabIndex === 1 ? "rgba(123, 97, 255, 0.1)" : "transparent",
                "&:hover": { backgroundColor: "rgba(123, 97, 255, 0.2)" },
              }} />
            </Tabs>
          </Box>
          <Box sx={{ p: 2, height: "calc(100% - 72px)" }}>
            {tabIndex === 0 && (
              <Typography sx={{ whiteSpace: "pre-wrap", fontSize: 14 }}>
                <strong>Problem: {problemName}</strong>{'\n\n'}
                Write a function that returns the sum of two integers.{'\n\n'}
                Example:{'\n'}Input: 3, 5{'\n'}Output: 8
              </Typography>
            )}
            {tabIndex === 1 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Past Submissions</Typography>
                <Box sx={{ backgroundColor: "#2b2b2b", borderRadius: "6px", p: 1, mb: 1 }}>
                  <Typography fontSize={13}>✅ Passed • 2025-04-19 • 34ms</Typography>
                </Box>
                <Box sx={{ backgroundColor: "#2b2b2b", borderRadius: "6px", p: 1 }}>
                  <Typography fontSize={13}>❌ Failed • 2025-04-19 • Test Case 2 Failed</Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Main Area and Toolkit */}
        <Box sx={{ width: "70%", display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Main Area */}
          <Box
            sx={{
              flexGrow: 1,
              backgroundImage: `radial-gradient(circle, rgba(77, 77, 77, 0.55) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
              backgroundColor: darkMode ? "#2c2c2c" : "#f0f0f0",
              borderRadius: "15px",
              p: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ProblemRightDraggableArea droppedBlocks= {droppedBlocks}/>
          </Box>
          {/* Toolkit Component */}
          <Box
            sx={{
              height: "30%",
              backgroundColor: darkMode ? "#353535" : "#ffffff",
              borderRadius: "15px",
              p: 2,
            }}
          >
            <ProblemToolKit />
          </Box>
        </Box>
      </Box>
    </Box>
    </DndContext>
  );
}

export default PracticeProblem;