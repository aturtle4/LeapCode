import React, { useState } from "react";
import { Box, Typography, IconButton, Button, Tabs, Tab } from "@mui/material";
import { ArrowBack, PlayArrow, CheckCircle, AccountCircle } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import ProblemToolKit from '../../components/PracticeProblem/ProblemToolKit';
import ProblemRightDraggableArea from "../../components/PracticeProblem/ProblemRightDraggableArea";
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';

function PracticeProblem({ darkMode }) {
  const navigate = useNavigate();
  const { problemid, problemName } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [droppedBlocks, setDroppedBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      // If dragged item is outside, delete it and its group members
      setDroppedBlocks((prev) => {
        const draggedBlock = prev.find((block) => block.id === active.id);
        if (!draggedBlock) return prev;
        return prev.filter((block) => block.groupId !== draggedBlock.groupId);
      });
    } else {
      // If it's dropped within the valid area, update position or add new block
      const isFromToolkit = active.data.current?.from === 'toolkit';
      const id = active.id;

      setDroppedBlocks((prev) => {
        const existing = prev.find((block) => block.id === id);
        const blockHeight = 50; // Approximate block height
        const snapDistance = 50;

        if (isFromToolkit && !existing) {
          // Add new block from toolkit
          const newBlock = { id, label: active.data.current.label, x: 0, y: 0 };
          // Check for snapping to existing blocks
          let snappedX = newBlock.x;
          let snappedY = newBlock.y;
          let minDistance = Infinity;
          let snappedGroupId = uuidv4(); // Default new group

          prev.forEach((block) => {
            const distanceAbove = Math.abs(newBlock.y - (block.y + blockHeight));
            const distanceBelow = Math.abs(newBlock.y - (block.y - blockHeight));

            if (distanceAbove <= snapDistance && distanceAbove < minDistance) {
              snappedY = block.y + blockHeight; // Snap to bottom
              snappedX = block.x; // Align x
              snappedGroupId = block.groupId; // Join group
              minDistance = distanceAbove;
            }
            if (distanceBelow <= snapDistance && distanceBelow < minDistance) {
              snappedY = block.y - blockHeight; // Snap to top
              snappedX = block.x; // Align x
              snappedGroupId = block.groupId; // Join group
              minDistance = distanceBelow;
            }
          });

          return [...prev, { ...newBlock, x: snappedX, y: snappedY, groupId: snappedGroupId }];
        }

        if (!isFromToolkit) {
          // Update position of existing block and its group
          const draggedBlock = prev.find((block) => block.id === id);
          if (!draggedBlock) return prev;

          // Move all blocks in the same group
          const updatedBlocks = prev.map((block) =>
            block.groupId === draggedBlock.groupId
              ? {
                  ...block,
                  x: block.x + event.delta.x,
                  y: block.y + event.delta.y,
                }
              : block
          );

          // Apply snapping to the dragged block
          const movedBlock = updatedBlocks.find((block) => block.id === id);
          let snappedX = movedBlock.x;
          let snappedY = movedBlock.y;
          let minDistance = Infinity;
          let snappedGroupId = movedBlock.groupId; // Default to current group

          updatedBlocks.forEach((block) => {
            if (block.groupId !== movedBlock.groupId) {
              const distanceAbove = Math.abs(movedBlock.y - (block.y + blockHeight));
              const distanceBelow = Math.abs(movedBlock.y - (block.y - blockHeight));

              if (distanceAbove <= snapDistance && distanceAbove < minDistance) {
                snappedY = block.y + blockHeight; // Snap to bottom
                snappedX = block.x; // Align x
                snappedGroupId = block.groupId; // Join new group
                minDistance = distanceAbove;
              }
              if (distanceBelow <= snapDistance && distanceBelow < minDistance) {
                snappedY = block.y - blockHeight; // Snap to top
                snappedX = block.x; // Align x
                snappedGroupId = block.groupId; // Join new group
                minDistance = distanceBelow;
              }
            }
          });

          // Update the dragged block's position and group, and move group to new position
          return updatedBlocks.map((block) =>
            block.groupId === draggedBlock.groupId
              ? {
                  ...block,
                  x: block.x - movedBlock.x + snappedX, // Adjust x relative to snapped position
                  y: block.y - movedBlock.y + snappedY, // Adjust y relative to snapped position
                  groupId: snappedGroupId,
                }
              : block
          );
        }

        return prev;
      });
    }
    setActiveBlock(null);
  };

  return (
    <DndContext
      onDragStart={(event) => {
        const { active } = event;
        setActiveBlock({
          id: active.id,
          label: active.data.current.label,
        });
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveBlock(null)}
    >
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
              {`${problemName}`}
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
                <Tab
                  label="Description"
                  sx={{
                    color: tabIndex === 0 ? "#7B61FF" : (darkMode ? "#d7d7d6" : "#403f3f"),
                    backgroundColor: tabIndex === 0 ? "rgba(123, 97, 255, 0.1)" : "transparent",
                    "&:hover": { backgroundColor: "rgba(123, 97, 255, 0.2)" },
                  }}
                />
                <Tab
                  label="Submissions"
                  sx={{
                    color: tabIndex === 1 ? "#7B61FF" : (darkMode ? "#d7d7d6" : "#403f3f"),
                    backgroundColor: tabIndex === 1 ? "rgba(123, 97, 255, 0.1)" : "transparent",
                    "&:hover": { backgroundColor: "rgba(123, 97, 255, 0.2)" },
                  }}
                />
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
              <ProblemRightDraggableArea droppedBlocks={droppedBlocks} />
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
      <DragOverlay zIndex={1000}>
        {activeBlock ? (
          <Box sx={{ padding: '8px 12px', backgroundColor: '#7B61FF', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>
            {activeBlock.label}
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default PracticeProblem;