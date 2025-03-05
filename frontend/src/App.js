import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Auth from "./Pages/Auth/Auth";
import ClassroomPage from "./Pages/Classrooms/Classroom";

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
      </Routes>
    </div>
  );
}

export default App;
