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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setDroppedBlocks((prev) => prev.filter((block) => block.id !== active.id));
      return;
    }

    const isFromToolkit = active.data.current?.from === 'toolkit';
    const id = active.id;
    const blockHeight = 30;
    const snapDistance = 40;
    const snapXDistance = 50;

    setDroppedBlocks((prev) => {
      if (isFromToolkit) {
        const newBlock = {
          id: `${active.data.current.category}-${Date.now()}`,
          label: active.data.current.label,
          type: active.data.current.type,
          category: active.data.current.category,
          color: active.data.current.color,
          x: 0,
          y: 0,
          children: active.data.current.canNest ? [] : null,
          canNest: active.data.current.canNest || false,
        };
        let snappedX = newBlock.x;
        let snappedY = newBlock.y;
        let minDistance = Infinity;
        let parentBlock = null;

        // Check for nesting
        prev.forEach((block) => {
          if (block.canNest && block.children) {
            const nestingAreaTop = block.y + 40; // Top section ~40px
            const nestingAreaBottom = block.y + 40 + (block.children ? block.children.length * 40 + 50 : 50);
            const nestingAreaLeft = block.x + 12;
            const nestingAreaRight = block.x + 220 - 12;

            if (
              snappedX >= nestingAreaLeft &&
              snappedX <= nestingAreaRight &&
              snappedY >= nestingAreaTop &&
              snappedY <= nestingAreaBottom
            ) {
              parentBlock = block;
              snappedX = snappedX - block.x;
              snappedY = snappedY - nestingAreaTop;
            }
          }
        });

        if (parentBlock) {
          return prev.map((block) =>
            block.id === parentBlock.id
              ? {
                  ...block,
                  children: [
                    ...block.children,
                    { ...newBlock, x: snappedX, y: snappedY, parentId: parentBlock.id },
                  ],
                }
              : block
          );
        }

        // Snap to other blocks
        prev.forEach((block) => {
          const distanceAbove = Math.abs(newBlock.y - (block.y + blockHeight));
          const distanceBelow = Math.abs(newBlock.y - (block.y - blockHeight));
          const distanceX = Math.abs(newBlock.x - block.x);

          if (distanceX <= snapXDistance) {
            if (distanceAbove <= snapDistance && distanceAbove < minDistance) {
              snappedY = block.y + blockHeight;
              snappedX = block.x;
              minDistance = distanceAbove;
            }
            if (distanceBelow <= snapDistance && distanceBelow < minDistance) {
              snappedY = block.y - blockHeight;
              snappedX = block.x;
              minDistance = distanceBelow;
            }
          }
        });

        return [...prev, { ...newBlock, x: snappedX, y: snappedY }];
      }

      // Handle dragging existing blocks
      const movedBlock = prev.find((block) => block.id === id);
      if (!movedBlock) return prev;

      const group = [];
      const visited = new Set();
      const findGroup = (currentBlock) => {
        if (visited.has(currentBlock.id)) return;
        visited.add(currentBlock.id);
        group.push(currentBlock);

        prev.forEach((block) => {
          if (block.id !== currentBlock.id) {
            const distanceAbove = Math.abs(currentBlock.y - (block.y + blockHeight));
            const distanceBelow = Math.abs(currentBlock.y - (block.y - blockHeight));
            const distanceX = Math.abs(currentBlock.x - block.x);
            if ((distanceAbove <= snapDistance || distanceBelow <= snapDistance) && distanceX <= snapXDistance) {
              findGroup(block);
            }
          }
        });
      };

      findGroup(movedBlock);

      const topBlock = group.reduce((top, block) => (!top || block.y < top.y ? block : top), null);

      if (topBlock && topBlock.id === id) {
        const deltaX = event.delta.x;
        const deltaY = event.delta.y;

        let newParentBlock = null;
        let snappedX = movedBlock.x + deltaX;
        let snappedY = movedBlock.y + deltaY;

        let minDistance = Infinity;
        prev.forEach((block) => {
          if (block.canNest && block.children && block.id !== id) {
            const nestingAreaTop = block.y + 40;
            const nestingAreaBottom = block.y + 40 + (block.children ? block.children.length * 40 + 50 : 50);
            const nestingAreaLeft = block.x + 12;
            const nestingAreaRight = block.x + 220 - 12;

            if (
              snappedX >= nestingAreaLeft &&
              snappedX <= nestingAreaRight &&
              snappedY >= nestingAreaTop &&
              snappedY <= nestingAreaBottom
            ) {
              newParentBlock = block;
              snappedX = snappedX - block.x;
              snappedY = snappedY - nestingAreaTop;
            }
          } else {
            const distanceAbove = Math.abs(snappedY - (block.y + blockHeight));
            const distanceBelow = Math.abs(snappedY - (block.y - blockHeight));
            const distanceX = Math.abs(snappedX - block.x);

            if (distanceX <= snapXDistance) {
              if (distanceAbove <= snapDistance && distanceAbove < minDistance) {
                snappedY = block.y + blockHeight;
                snappedX = block.x;
                minDistance = distanceAbove;
              }
              if (distanceBelow <= snapDistance && distanceBelow < minDistance) {
                snappedY = block.y - blockHeight;
                snappedX = block.x;
                minDistance = distanceBelow;
              }
            }
          }
        });

        if (newParentBlock) {
          let updatedBlocks = prev.filter((block) => !group.some((g) => g.id === block.id));
          updatedBlocks = updatedBlocks.map((block) =>
            block.id === newParentBlock.id
              ? {
                  ...block,
                  children: [
                    ...block.children,
                    ...group.map((g) => ({
                      ...g,
                      x: g === movedBlock ? snappedX : g.x,
                      y: g === movedBlock ? snappedY : g.y,
                      parentId: newParentBlock.id,
                    })),
                  ],
                }
              : block
          );
          return updatedBlocks;
        }

        // Handle detachment if dragged out of parent
        if (movedBlock.parentId) {
          const parentBlock = prev.find((block) => block.id === movedBlock.parentId);
          if (parentBlock) {
            const nestingAreaTop = parentBlock.y + 40;
            const nestingAreaBottom = parentBlock.y + 40 + (parentBlock.children ? parentBlock.children.length * 40 + 50 : 50);
            const nestingAreaLeft = parentBlock.x + 12;
            const nestingAreaRight = parentBlock.x + 220 - 12;

            if (
              snappedX < nestingAreaLeft - 20 ||
              snappedX > nestingAreaRight + 20 ||
              snappedY < nestingAreaTop - 20 ||
              snappedY > nestingAreaBottom + 20
            ) {
              let updatedBlocks = prev.map((block) =>
                block.id === parentBlock.id
                  ? { ...block, children: block.children.filter((child) => child.id !== movedBlock.id) }
                  : block
              );
              return updatedBlocks.map((block) =>
                group.some((g) => g.id === block.id)
                  ? { ...block, x: block.x + deltaX, y: block.y + deltaY, parentId: null }
                  : block
              );
            }
          }
        }

        return prev.map((block) =>
          group.some((g) => g.id === block.id)
            ? {
                ...block,
                x: block.id === id ? snappedX : block.x + deltaX,
                y: block.id === id ? snappedY : block.y + deltaY,
                parentId: null,
              }
            : block
        );
      }

      return prev;
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
          canNest: active.data.current.canNest,
          color: active.data.current.color,
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

        <Box sx={{ display: "flex", height: "calc(100vh - 140px)", gap: 2 }}>
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
                  <Box sx={{ backgroundColor: "#fff", borderRadius: "6px", p: 1, mb: 1 }}>
                    <Typography fontSize={13}>✅ Passed • 2025-04-19 • 34ms</Typography>
                  </Box>
                  <Box sx={{ backgroundColor: "#fff", borderRadius: "6px", p: 1 }}>
                    <Typography fontSize={13}>❌ Failed • 2025-04-19 • Test Case 2 Failed</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ width: "70%", display: "flex", flexDirection: "column", gap: 2 }}>
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
          <Box
            sx={{
              padding: '8px 12px',
              backgroundColor: activeBlock.color || '#7B61FF',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 'bold',
              ...(activeBlock.canNest && {
                borderTop: '40px solid rgba(0, 0, 0, 0.1)',
                borderBottom: '12px solid rgba(0, 0, 0, 0.1)',
                padding: '8px 12px 8px 12px',
              }),
            }}
          >
            {activeBlock.label}
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default PracticeProblem;