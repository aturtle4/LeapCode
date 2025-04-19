import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import AuthCallback from "./pages/Auth/AuthCallback";
import ClassroomPage from "./pages/Classrooms/Classroom";
import SkillTree from "./pages/SkillTree/SkillTree";
import PracticeProblem from "./pages/PracticeProblem/PracticeProblem";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
