import React, { useState } from "react";
import { Box, Typography, IconButton, Button, Tabs, Tab } from "@mui/material";
import { ArrowBack, PlayArrow, CheckCircle, AccountCircle } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import ProblemToolKit from '../../components/PracticeProblem/ProblemToolKit';
import ProblemRightDraggableArea from "../../components/PracticeProblem/ProblemRightDraggableArea";
import { DndContext, DragOverlay } from '@dnd-kit/core';

function PracticeProblem({ darkMode }) {
  const navigate = useNavigate();
  const { problemid, problemName } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [droppedBlocks, setDroppedBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };
  const handleRun = () => {
    console.log(droppedBlocks)
  };
  

  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    if (!over) {
      setDroppedBlocks((prev) => prev.filter((block) => block.id !== active.id));
      return;
    }
  
    const isFromToolkit = active.data.current?.from === 'toolkit';
  
    setDroppedBlocks((prev) => {
      const blockHeight = 50;
      const snapDistance = 50;
      const generateId = () => `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const blocksCopy = [...prev];
  
      const findSnapTarget = (movedBlock, skipId = null) => {
        let snapTo = null;
        let snappedY = movedBlock.y;
        let snappedX = movedBlock.x;
        let direction = null;
        let minDistance = Infinity;
  
        for (const block of blocksCopy) {
          if (block.id === skipId) continue;
  
          const distanceAbove = Math.abs(movedBlock.y - (block.y + blockHeight));
          const distanceBelow = Math.abs(movedBlock.y - (block.y - blockHeight));
  
          if (distanceAbove <= snapDistance && distanceAbove < minDistance) {
            snappedY = block.y + blockHeight;
            snappedX = block.x;
            snapTo = block;
            direction = 'below'; // moved block is below snapTo
            minDistance = distanceAbove;
          }
          if (distanceBelow <= snapDistance && distanceBelow < minDistance) {
            snappedY = block.y - blockHeight;
            snappedX = block.x;
            snapTo = block;
            direction = 'above'; // moved block is above snapTo
            minDistance = distanceBelow;
          }
        }
  
        return { snapTo, snappedX, snappedY, direction };
      };
  
      const applySnapRelationship = (movedBlock, snapTo, direction) => {
        let updatedSnapTo = { ...snapTo };
        let updatedMovedBlock = { ...movedBlock };
  
        // Reset nestedBlocks if not allowed
        if (!updatedSnapTo.canNest) updatedSnapTo.nestedBlocks = [];
        if (!updatedMovedBlock.canNest) updatedMovedBlock.nestedBlocks = [];
  
        if (direction === 'above') {
          // Moved block is above — it becomes parent
          updatedMovedBlock.childId = updatedSnapTo.id;
          updatedSnapTo.parentId = updatedMovedBlock.id;
  
          if (updatedMovedBlock.canNest) {
            updatedMovedBlock.nestedBlocks = [...new Set([...(updatedMovedBlock.nestedBlocks || []), updatedSnapTo.id])];
          }
        } else if (direction === 'below') {
          // Moved block is below — it becomes child
          updatedMovedBlock.parentId = updatedSnapTo.id;
          updatedSnapTo.childId = updatedMovedBlock.id;
  
          if (updatedSnapTo.canNest) {
            updatedSnapTo.nestedBlocks = [...new Set([...(updatedSnapTo.nestedBlocks || []), updatedMovedBlock.id])];
          }
        }
  
        return { updatedMovedBlock, updatedSnapTo };
      };
  
      if (isFromToolkit) {
        const newId = generateId();
        const newBlock = {
          id: newId,
          label: active.data.current.label,
          x: 0,
          y: 0,
          parentId: null,
          childId: null,
          canNest: active.data.current.canNest || false,
          nestedBlocks: [],
        };
  
        const { snapTo, snappedX, snappedY, direction } = findSnapTarget(newBlock);
        newBlock.x = snappedX;
        newBlock.y = snappedY;
  
        if (snapTo && direction) {
          const { updatedMovedBlock, updatedSnapTo } = applySnapRelationship(newBlock, snapTo, direction);
          return [
            ...blocksCopy.map(b => (b.id === updatedSnapTo.id ? updatedSnapTo : b)),
            updatedMovedBlock,
          ];
        }
  
        return [...blocksCopy, newBlock];
      }
  
      // Existing block being moved
      const blockIndex = blocksCopy.findIndex((b) => b.id === active.id);
      if (blockIndex === -1) return blocksCopy;
  
      const movedBlock = { ...blocksCopy[blockIndex] };
      movedBlock.x += event.delta.x;
      movedBlock.y += event.delta.y;
  
      // Remove from previous parent's nested list
      if (movedBlock.parentId) {
        const oldParentIndex = blocksCopy.findIndex((b) => b.id === movedBlock.parentId);
        if (oldParentIndex !== -1) {
          const oldParent = { ...blocksCopy[oldParentIndex] };
          oldParent.nestedBlocks = oldParent.nestedBlocks?.filter((nid) => nid !== movedBlock.id);
          if (oldParent.childId === movedBlock.id) oldParent.childId = null;
          blocksCopy[oldParentIndex] = oldParent;
        }
      }
  
      movedBlock.parentId = null;
      movedBlock.childId = null;
  
      const { snapTo, snappedX, snappedY, direction } = findSnapTarget(movedBlock, movedBlock.id);
      movedBlock.x = snappedX;
      movedBlock.y = snappedY;
  
      let updatedBlocks = blocksCopy.map((b) => (b.id === movedBlock.id ? movedBlock : b));
  
      if (snapTo && direction) {
        const { updatedMovedBlock, updatedSnapTo } = applySnapRelationship(movedBlock, snapTo, direction);
  
        updatedBlocks = updatedBlocks.map((b) =>
          b.id === updatedMovedBlock.id
            ? updatedMovedBlock
            : b.id === updatedSnapTo.id
            ? updatedSnapTo
            : b
        );
      }
  
      return updatedBlocks;
    });
  
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
              onClick={handleRun}
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