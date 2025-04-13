import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import ClassroomPage from "./pages/Classrooms/Classroom";
import SkillTree from "./pages/SkillTree/SkillTree";
import PracticeProblem from "./pages/PracticeProblem/PracticeProblem";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/home" element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/classroom/:id" element={<ClassroomPage darkMode={darkMode} toggleDarkMode = {toggleDarkMode} />} />
        <Route path="/skillTree/:id" element={<SkillTree darkMode={darkMode} toggleDarkMode = {toggleDarkMode} />} />
        <Route path="/skillTree/:treeid/PracticeProblem/:problemName/:problemid" element={<PracticeProblem darkMode={darkMode} toggleDarkMode = {toggleDarkMode} />} />
      </Routes>
    </div>
  );
}

export default App;
