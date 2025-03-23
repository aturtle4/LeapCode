import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ArrowBack, ExpandLess, ExpandMore } from "@mui/icons-material";



function SkillTree({ darkMode, toggleDarkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedSteps, setExpandedSteps] = useState({});


  const skillTrees = [
    { skilTreeID: "ST1", title: "OOPs Fundamentals", bgColor: "#e74c3c", guide: "", percentageCompleted: 59, nextDeadline: "" },
    { skilTreeID: "ST2", title: "Design Patterns: 101", bgColor: "#f39c12", guide: "Dr. Noel Tiju", percentageCompleted: 10, nextDeadline: "10 March" },
    { skilTreeID: "ST3", title: "Data Structures Mastery", bgColor: "#3498db", guide: "", percentageCompleted: 35, nextDeadline: "" },
    { skilTreeID: "ST4", title: "Competitive Programming Essentials", bgColor: "#2ecc71", guide: "Prof. Daniel", percentageCompleted: 20, nextDeadline: "15 March" },
    { skilTreeID: "ST5", title: "SQL & Databases", bgColor: "#9b59b6", guide: "", percentageCompleted: 75, nextDeadline: "" },
    { skilTreeID: "ST6", title: "Algorithm Explorer", bgColor: "#f39c12", guide: "Dr. Smith", percentageCompleted: 50, nextDeadline: "22 March" },
  ];

  const skillTree = skillTrees.find((c) => c.skilTreeID === id);

  if (!skillTree) {
    return (
      <Typography variant="h4" sx={{ textAlign: "center", mt: 5 }}>
        Skill Tree Not Found
      </Typography>
    );
  }

  // Dummy nodes for each skill tree
  const skillTreeNodes = {
    ST1: [
      {
        title: "Introduction to OOP",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/WqQsuIW2k0M",
            title: "What is Object-Oriented Programming?",
          },
          {
            type: "text",
            content: "OOP is a programming paradigm that organizes code using objects and classes...",
          },
          {
            type: "problem",
            content: "Define a simple `Person` class in Java with attributes `name` and `age`.",
          },
        ],
      },
      {
        title: "Classes and Objects",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/kJEsTjH5mVg",
            title: "Understanding Classes and Objects",
          },
          {
            type: "text",
            content: "A class is a blueprint for creating objects. It defines properties and behaviors.",
          },
          {
            type: "problem",
            content: "Create a `Car` class in Java with methods `accelerate()` and `brake()`.",
          },
        ],
      },
      {
        title: "Encapsulation and Abstraction",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/W7mR3M5mwdU",
            title: "Encapsulation Explained",
          },
          {
            type: "text",
            content: "Encapsulation is the bundling of data with methods that operate on the data...",
          },
          {
            type: "problem",
            content: "Modify the `Car` class to make its attributes private and add getter methods.",
          },
        ],
      },
    ],
  
    ST2: [
      {
        title: "Introduction to Design Patterns",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/NU_1StN5Tkk",
            title: "What are Design Patterns?",
          },
          {
            type: "text",
            content: "Design patterns provide reusable solutions to common software design problems...",
          },
          {
            type: "problem",
            content: "List three commonly used design patterns and briefly describe their use cases.",
          },
        ],
      },
      {
        title: "Singleton Pattern",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/hUE_j6q0LTQ",
            title: "Understanding the Singleton Pattern",
          },
          {
            type: "text",
            content: "The Singleton Pattern ensures that a class has only one instance and provides a global point of access...",
          },
          {
            type: "problem",
            content: "Implement the Singleton pattern in Python with a private constructor.",
          },
        ],
      },
      {
        title: "Factory Pattern",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/ExhgZZlzD6g",
            title: "Factory Pattern in Action",
          },
          {
            type: "text",
            content: "The Factory Pattern is used to create objects without specifying the exact class...",
          },
          {
            type: "problem",
            content: "Implement a `ShapeFactory` in Java that creates objects of different shape types (Circle, Square).",
          },
        ],
      },
    ],
  
    ST3: [
      {
        title: "Arrays and Linked Lists",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/B31LgI4Y4DQ",
            title: "Understanding Data Structures",
          },
          {
            type: "text",
            content: "Arrays and linked lists are fundamental data structures that store collections of data...",
          },
          {
            type: "problem",
            content: "Implement a linked list in C++ with `insert()` and `delete()` functions.",
          },
        ],
      },
      {
        title: "Stacks and Queues",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/0umWm9I2ZQ0",
            title: "Stacks and Queues Explained",
          },
          {
            type: "text",
            content: "Stacks follow LIFO (Last In First Out), whereas queues follow FIFO (First In First Out)...",
          },
          {
            type: "problem",
            content: "Implement a stack using an array in Python.",
          },
        ],
      },
      {
        title: "Trees and Graphs",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/K7J3nCeRC80",
            title: "Introduction to Trees and Graphs",
          },
          {
            type: "text",
            content: "Trees and graphs are non-linear data structures used for hierarchical data representation...",
          },
          {
            type: "problem",
            content: "Implement a binary search tree in Java.",
          },
        ],
      },
    ],
  
    ST4: [
      {
        title: "Competitive Programming Basics",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/ekcwMsSIzVc",
            title: "How to Start Competitive Programming",
          },
          {
            type: "text",
            content: "Competitive programming involves solving algorithmic problems efficiently...",
          },
          {
            type: "problem",
            content: "Solve the 'Two Sum' problem on LeetCode.",
          },
        ],
      },
      {
        title: "Time Complexity Analysis",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/FPu9Uld7W-E",
            title: "Understanding Big-O Notation",
          },
          {
            type: "text",
            content: "Time complexity helps us analyze how the execution time of an algorithm grows...",
          },
          {
            type: "problem",
            content: "Analyze the time complexity of the Bubble Sort algorithm.",
          },
        ],
      },
    ],
  
    ST5: [
      {
        title: "SQL Basics",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/HXV3zeQKqGY",
            title: "Introduction to SQL",
          },
          {
            type: "text",
            content: "SQL (Structured Query Language) is used to manage and query relational databases...",
          },
          {
            type: "problem",
            content: "Write an SQL query to fetch all employees with a salary above $50,000.",
          },
        ],
      },
      {
        title: "Joins and Subqueries",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/2HVMiPPuPIM",
            title: "Understanding SQL Joins",
          },
          {
            type: "text",
            content: "Joins allow us to combine data from multiple tables...",
          },
          {
            type: "problem",
            content: "Write an SQL query to get all orders with customer details using INNER JOIN.",
          },
        ],
      },
    ],
  
    ST6: [
      {
        title: "Sorting Algorithms",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/e0XskN3HTgU",
            title: "Sorting Algorithms Explained",
          },
          {
            type: "text",
            content: "Sorting algorithms are used to arrange data in a specific order...",
          },
          {
            type: "problem",
            content: "Implement the Merge Sort algorithm in C++.",
          },
        ],
      },
      {
        title: "Graph Algorithms",
        steps: [
          {
            type: "video",
            content: "https://www.youtube.com/embed/09_LlHjoEiY",
            title: "Introduction to Graph Algorithms",
          },
          {
            type: "text",
            content: "Graph algorithms help solve problems involving networks, paths, and relationships...",
          },
          {
            type: "problem",
            content: "Implement Dijkstra's algorithm in Python.",
          },
        ],
      },
    ],
  };
  
  const nodes = skillTreeNodes[id] || [];

  const toggleStep = (nodeIndex, stepIndex) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [`${nodeIndex}-${stepIndex}`]: !prev[`${nodeIndex}-${stepIndex}`],
    }));
  };

  return (
    <div >
    <Box
      sx={{
        maxHeight: "100vh",
        backgroundColor: darkMode ? "#353535" : "#d9d9d9",
        color: darkMode ? "#d7d7d6" : "#403f3f",
        padding: "20px",
      }}
    >
      {/* Header */}
      <Paper
        sx={{
          padding: "20px",
          borderRadius: "20px",
          backgroundColor: skillTree.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={() => navigate("/home")} sx={{ color: "#d7d7d6" }}>
          <ArrowBack fontSize="large" />
        </IconButton>
        <Box sx={{ textAlign: "center", flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold" color="#d7d7d6">
            {skillTree.title}
          </Typography>
          {skillTree.guide && (
            <Typography variant="body1" color="#d7d7d6">
              Guide: {skillTree.guide}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Skill Tree Content */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, marginTop: "20px", maxHeight: "85vh", overflowY: "auto"}}>
        {nodes.map((node, nodeIndex) => (
          <Paper
            key={nodeIndex}
            sx={{
              padding: "20px",
              borderRadius: "20px",
              backgroundColor: darkMode ? "#424242" : "#ffffff",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {node.title || `Node ${nodeIndex + 1}`}
            </Typography>

            {node.steps.map((step, stepIndex) => (
              <Box key={stepIndex} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" fontWeight="bold">
                    {step.title || `Step ${stepIndex + 1}`}
                  </Typography>
                  <IconButton onClick={() => toggleStep(nodeIndex, stepIndex)}>
                    {expandedSteps[`${nodeIndex}-${stepIndex}`] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Collapse in={expandedSteps[`${nodeIndex}-${stepIndex}`]}>
                  {step.type === "video" && (
                    <Box sx={{ mt: 2 }}>
                      <iframe
                        width="100%"
                        height="315"
                        src={step.content}
                        title={`Video ${stepIndex + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </Box>
                  )}

                  {step.type === "text" && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {step.content}
                    </Typography>
                  )}

                  {step.type === "problem" && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Problem:
                      </Typography>
                      <Typography variant="body1">{step.content}</Typography>
                    </Box>
                  )}
                </Collapse>
              </Box>
            ))}
          </Paper>
        ))}
      </Box>
    </Box>
    </div>
  );
}

export default SkillTree;
