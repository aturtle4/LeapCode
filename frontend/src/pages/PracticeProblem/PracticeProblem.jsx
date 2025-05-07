import React, { useState } from "react";
import { Box, Typography, IconButton, Button, Tabs, Tab } from "@mui/material";
import { ArrowBack, PlayArrow, CheckCircle, AccountCircle } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import ProblemToolKit from '../../components/PracticeProblem/ProblemToolKit';
import ProblemRightDraggableArea from "../../components/PracticeProblem/ProblemRightDraggableArea";
import { DndContext, DragOverlay, pointerWithin, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import DragOverlayComponent from "../../components/PracticeProblem/DragOverlay";

function PracticeProblem({ darkMode }) {
  const navigate = useNavigate();
  const { problemid, problemName } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [droppedBlocks, setDroppedBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);
  
  // Configure sensors with strict activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // A pointer must move by at least 15px before drag starts
      activationConstraint: {
        distance: 15,
        // Add a small delay to prevent accidental drags
        delay: 150,
        // Tolerance for movement during the delay
        tolerance: 5,
      },
    })
  );

  // Function to find a block by ID in the entire block structure
  const findBlockById = (blocks, id) => {
    if (!id || !blocks || !Array.isArray(blocks)) return null;
    
    for (const block of blocks) {
      if (!block) continue;
      if (block.id === id) return block;
      
      // Check in nested blocks if they exist
      if (block.nestedBlocks && block.nestedBlocks.length > 0) {
        const nestedResult = findBlockById(block.nestedBlocks, id);
        if (nestedResult) return nestedResult;
      }
    }
    return null;
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };
  const handleRun = () => {
    logNestedBlockStructure(droppedBlocks);
    console.log(droppedBlocks);
  };
  
  // Helper function to log the nested block structure for debugging
  const logNestedBlockStructure = (blocks, level = 0) => {
    if (!blocks || !Array.isArray(blocks)) return;
    
    blocks.forEach(block => {
      const indent = '  '.repeat(level);
      console.log(`${indent}Block: ${block.id} (${block.label}) - Type: ${block.type}`);
      
      if (block.nestedBlocks && block.nestedBlocks.length > 0) {
        console.log(`${indent}Nested blocks of ${block.id}:`);
        logNestedBlockStructure(block.nestedBlocks, level + 1);
      }
    });
  };
  
  const handleDragEnd = (event) => {
    const { active, over, delta } = event;
    
    // Check if the drag was too small (possibly just a click)
    const isSmallDrag = Math.abs(delta.x) < 5 && Math.abs(delta.y) < 5;
    
    // If it's a small drag on a block that's not from toolkit, treat as a click
    if (isSmallDrag && active.data.current?.from !== 'toolkit') {
      setActiveBlock(null);
      return;
    }
  
    if (!over) {
      // If dropping outside any droppable area, remove from droppedBlocks if it's from workspace
      if (active.data.current?.from !== 'toolkit') {
        setDroppedBlocks((prev) => prev.filter((block) => block.id !== active.id));
      }
      setActiveBlock(null);
      return;
    }
  
    const isFromToolkit = active.data.current?.from === 'toolkit';
    
    setDroppedBlocks((prev) => {
      const blocksCopy = JSON.parse(JSON.stringify(prev)); // Deep copy to avoid reference issues
      const blockHeight = 90;
      const snapDistance = 50;
      const generateId = () => `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Function to update a block anywhere in the tree structure
      const updateBlockInTree = (blocks, updatedBlock) => {
        return blocks.map(block => {
          if (block.id === updatedBlock.id) {
            return updatedBlock;
          }
          
          // Check in nested blocks
          if (block.nestedBlocks && block.nestedBlocks.length > 0) {
            return {
              ...block,
              nestedBlocks: updateBlockInTree(block.nestedBlocks, updatedBlock)
            };
          }
          
          return block;
        });
      };

      // Handle drops into nesting areas (if, for, while blocks)
      if (over.id.startsWith('nesting-')) {
        const parentId = over.id.replace('nesting-', '');
        const parentBlock = findBlockById(blocksCopy, parentId);
        
        // Don't allow nesting if parent block doesn't exist or cannot nest
        if (!parentBlock || !parentBlock.canNest) return blocksCopy;
        
        // Don't allow self-nesting (a block cannot be nested inside itself)
        if (parentId === active.id) {
          console.log("Self-nesting prevented: A block cannot be nested inside itself");
          return blocksCopy;
        }
        
        // Check if we're trying to nest a parent inside its own child (cyclic nesting)
        const isParentOfActive = (potentialParent, activeId) => {
          if (!potentialParent || !potentialParent.nestedBlocks) return false;
          
          // Check if any direct nested block is the active block
          if (potentialParent.nestedBlocks.some(block => block.id === activeId)) {
            return true;
          }
          
          // Recursively check nested blocks
          return potentialParent.nestedBlocks.some(block => isParentOfActive(block, activeId));
        };
        
        // If the active block is already a parent of the drop target, prevent the nesting
        if (!isFromToolkit && isParentOfActive(findBlockById(blocksCopy, active.id), parentId)) {
          console.log("Cyclic nesting prevented: Cannot nest a parent inside its own child");
          return blocksCopy;
        }
        
        // Initialize nestedBlocks if it doesn't exist
        if (!parentBlock.nestedBlocks) {
          parentBlock.nestedBlocks = [];
        }
  
        if (isFromToolkit) {
          // Create a new block from toolkit
          const newId = generateId();
          const newBlock = {
            id: newId,
            label: active.data.current.label,
            type: active.data.current.type,
            x: 0,
            y: 0,
            parentId,
            childId: null,
            canNest: active.data.current.canNest || false,
            nestedBlocks: [],
            positioning: 'static',
            color: active.data.current.color,
          };
          
          // Add to parent's nestedBlocks
          parentBlock.nestedBlocks.push(newBlock);
          
          // Return a new state with both updated parent block and new block
          return blocksCopy.map(block => 
            block.id === parentId ? parentBlock : block
          );
        } else {
          // Moving an existing block into a nesting area
          const blockToMove = findBlockById(blocksCopy, active.id);
          if (!blockToMove) return blocksCopy;
          
          // Skip if block is already nested in this parent
          const isAlreadyNested = parentBlock.nestedBlocks && parentBlock.nestedBlocks.some(block => block.id === active.id);
          if (isAlreadyNested) return blocksCopy;
          
          // Create a deep copy to preserve nested blocks structure
          const movedBlockCopy = JSON.parse(JSON.stringify(blockToMove));
          // Update properties for nesting
          movedBlockCopy.parentId = parentId;
          movedBlockCopy.positioning = 'static';
          
          // Add to parent's nestedBlocks
          parentBlock.nestedBlocks.push(movedBlockCopy);
          
          // Update the parent block in the blocksCopy
          let updatedBlocks = blocksCopy.map(block => 
            block.id === parentId ? parentBlock : block
          );
          
          // If block to move was at top level, remove it
          if (!blockToMove.parentId) {
            return updatedBlocks.filter(block => block.id !== active.id);
          } 
          // If it was in another parent, remove from that parent's nested blocks
          else {
            const oldParent = findBlockById(updatedBlocks, blockToMove.parentId);
            if (oldParent && oldParent.nestedBlocks) {
              oldParent.nestedBlocks = oldParent.nestedBlocks.filter(block => 
                block.id !== active.id
              );
              
              return updatedBlocks.map(block => 
                block.id === oldParent.id ? oldParent : block
              );
            }
          }
          
          return updatedBlocks;
        }
      }
  
      // Handle snapping logic for top-level blocks
      const findSnapTarget = (movedBlock, skipId = null) => {
        let snapTo = null;
        let snappedY = movedBlock.y;
        let snappedX = movedBlock.x;
        let direction = null;
        let minDistance = Infinity;
  
        for (const block of blocksCopy) {
          if (block.id === skipId) continue;
          
          // Don't snap to nested blocks
          if (block.parentId) continue;
  
          const distanceAbove = Math.abs(movedBlock.y - (block.y + blockHeight));
          const distanceBelow = Math.abs(movedBlock.y - (block.y - blockHeight));
  
          if (distanceAbove <= snapDistance && distanceAbove < minDistance) {
            snappedY = block.y + blockHeight;
            snappedX = block.x;
            snapTo = block;
            direction = 'below';
            minDistance = distanceAbove;
          }
          
          if (distanceBelow <= snapDistance && distanceBelow < minDistance) {
            snappedY = block.y - blockHeight;
            snappedX = block.x;
            snapTo = block;
            direction = 'above';
            minDistance = distanceBelow;
          }
        }
  
        return { snapTo, snappedX, snappedY, direction };
      };
  
      const applySnapRelationship = (movedBlock, snapTo, direction) => {
        let updatedSnapTo = { ...snapTo };
        let updatedMovedBlock = { ...movedBlock };
  
        if (!updatedSnapTo.nestedBlocks) updatedSnapTo.nestedBlocks = [];
        if (!updatedMovedBlock.nestedBlocks) updatedMovedBlock.nestedBlocks = [];
  
        if (direction === 'above') {
          updatedMovedBlock.childId = updatedSnapTo.id;
          updatedSnapTo.parentId = updatedMovedBlock.id;
        } else if (direction === 'below') {
          updatedMovedBlock.parentId = updatedSnapTo.id;
          updatedSnapTo.childId = updatedMovedBlock.id;
        }
  
        return { updatedMovedBlock, updatedSnapTo };
      };
  
      if (isFromToolkit && over.id === 'droppable-area') {
        // Creating a new block from toolkit in the main area
        const newId = generateId();
        const newBlock = {
          id: newId,
          label: active.data.current.label,
          type: active.data.current.type,
          x: event.over.rect ? event.clientX - 50 : 50,
          y: event.over.rect ? event.clientY - 50 : 50,
          parentId: null,
          childId: null,
          canNest: active.data.current.canNest || false,
          nestedBlocks: [],
          color: active.data.current.color,
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
      } else if (!isFromToolkit && over.id === 'droppable-area') {
        // Moving existing block to a new position in the main area
        const blockToMove = findBlockById(blocksCopy, active.id);
        if (!blockToMove) return blocksCopy;
        
        // Skip if it's a nested block - handle differently
        if (blockToMove.parentId && blockToMove.positioning === 'static') {
          // Move from nested position to main area
          const oldParent = findBlockById(blocksCopy, blockToMove.parentId);
          
          if (oldParent && oldParent.nestedBlocks) {
            // Create a deep copy of the block to maintain its nested structure
            const nestedBlockCopy = JSON.parse(JSON.stringify(blockToMove));
            
            // Create a new version of the block for the main area
            const newMainBlock = {
              ...nestedBlockCopy,
              parentId: null,
              positioning: 'absolute',
              x: event.over.rect ? event.clientX - 50 : 50,
              y: event.over.rect ? event.clientY - 50 : 50,
            };
            
            // Remove from old parent's nestedBlocks
            oldParent.nestedBlocks = oldParent.nestedBlocks.filter(b => b.id !== blockToMove.id);
            
            // Update the old parent in the state
            const updatedWithParent = blocksCopy.map(b => 
              b.id === oldParent.id ? oldParent : b
            );
            
            // Apply snapping
            const { snapTo, snappedX, snappedY, direction } = findSnapTarget(newMainBlock);
            newMainBlock.x = snappedX;
            newMainBlock.y = snappedY;
            
            if (snapTo && direction) {
              const { updatedMovedBlock, updatedSnapTo } = applySnapRelationship(newMainBlock, snapTo, direction);
              const updatedBlocks = updatedWithParent.map(b => 
                b.id === updatedSnapTo.id ? updatedSnapTo : b
              );
              return [...updatedBlocks, updatedMovedBlock];
            }
            
            return [...updatedWithParent, newMainBlock];
          }
        }
        
        // Regular movement in main area
        const blockIndex = blocksCopy.findIndex((b) => b.id === active.id);
        if (blockIndex === -1) return blocksCopy;
  
        const deltaX = event.delta.x;
        const deltaY = event.delta.y;
  
        const movedBlock = { ...blocksCopy[blockIndex] };
        movedBlock.x += deltaX;
        movedBlock.y += deltaY;
        
        // Preserve nested blocks when moving
        if (blocksCopy[blockIndex].nestedBlocks) {
          movedBlock.nestedBlocks = JSON.parse(JSON.stringify(blocksCopy[blockIndex].nestedBlocks));
        }
  
        // Remove from previous connections
        if (movedBlock.parentId) {
          const oldParentIndex = blocksCopy.findIndex((b) => b.id === movedBlock.parentId);
          if (oldParentIndex !== -1) {
            const oldParent = { ...blocksCopy[oldParentIndex] };
            if (oldParent.childId === movedBlock.id) oldParent.childId = null;
            blocksCopy[oldParentIndex] = oldParent;
          }
        }
        
        if (movedBlock.childId) {
          const oldChildIndex = blocksCopy.findIndex((b) => b.id === movedBlock.childId);
          if (oldChildIndex !== -1) {
            const oldChild = { ...blocksCopy[oldChildIndex] };
            if (oldChild.parentId === movedBlock.id) oldChild.parentId = null;
            blocksCopy[oldChildIndex] = oldChild;
          }
        }
  
        movedBlock.parentId = null;
        movedBlock.childId = null;
  
        const { snapTo, snappedX, snappedY, direction } = findSnapTarget(movedBlock, movedBlock.id);
        movedBlock.x = snappedX;
        movedBlock.y = snappedY;
  
        blocksCopy[blockIndex] = movedBlock;
  
        if (snapTo && direction) {
          const { updatedMovedBlock, updatedSnapTo } = applySnapRelationship(movedBlock, snapTo, direction);
  
          return blocksCopy.map((b) =>
            b.id === updatedMovedBlock.id
              ? updatedMovedBlock
              : b.id === updatedSnapTo.id
                ? updatedSnapTo
                : b
          );
        }
  
        return blocksCopy;
      }
      
      return blocksCopy;
    });
  
    setActiveBlock(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={(event) => {
        const { active } = event;
        const activeBlockData = findBlockById(droppedBlocks, active.id);
        setActiveBlock({
          id: active.id,
          label: active.data.current.label,
          from: active.data.current.from,
          type: active.data.current.type,
          parentId: activeBlockData?.parentId,
          initialMousePosition: {
            x: event.activatorEvent.clientX,
            y: event.activatorEvent.clientY
          }
        });
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveBlock(null)}
      measuring={{
        draggable: {
          minimum: 10,
        }
      }}
      modifiers={{
        threshold: {
          delay: 200,
          tolerance: 10,
        }
      }}
      activationConstraint={{
        distance: 15,
        delay: 200,
        tolerance: 10,
      }}
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
      <DragOverlayComponent activeBlock={activeBlock} allBlocks={droppedBlocks} />
    </DndContext>
  );
}

export default PracticeProblem;