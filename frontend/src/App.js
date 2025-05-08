import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import AuthCallback from "./pages/Auth/AuthCallback";
import ClassroomPage from "./pages/Classrooms/Classroom";
import SkillTree from "./pages/SkillTree/SkillTree";
import PracticeProblem from "./pages/PracticeProblem/PracticeProblem";
import ProblemsPage from "./pages/Problem/ProblemsPage";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  // Initialize darkMode state from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  
  const toggleDarkMode = () => {
    const newDarkModeValue = !darkMode;
    setDarkMode(newDarkModeValue);
    // Save to localStorage whenever it changes
    localStorage.setItem("theme", JSON.stringify(newDarkModeValue));
  };

  // Apply theme to document body so it can be used in CSS
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<Auth darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/classroom/:id" element={
            <ProtectedRoute>
              <ClassroomPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/skillTree/:id" element={
            <ProtectedRoute>
              <SkillTree darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/skillTree/:treeid/PracticeProblem/:problemName/:problemid" element={
            <ProtectedRoute>
              <PracticeProblem darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/problems" element={
            <ProtectedRoute requireTeacher={true}>
              <ProblemsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
