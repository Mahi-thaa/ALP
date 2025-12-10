import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginSignup from "./pages/LoginSignup";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import LearningModules from './pages/LearningModules';
import Activities from './pages/Activities'; 
import EnglishMCQ from './pages/EnglishMCQ';
import EnglishWordMatch from './pages/EnglishWordMatch';
import EnglishStoryBuilder from './pages/EnglishStoryBuilder';
import MathMaze from './pages/MathMaze';
import MathMCQ from './pages/MathMCQ';
import MathNumberPuzzle from './pages/MathNumberPuzzle';
import LogicalMCQ from './pages/LogicalMCQ';
import ShapeMatcher from './pages/LogicalShapeMatcher';
import LogicalSequenceGame from "./pages/LogicalSequenceGame";
import Navbar from './components/Navbar';
import FaceEmotionDetector from './components/FaceEmotionDetector';
import { ProgressProvider } from './pages/ProgressContext';

function AppWrapper() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('currentUser'));

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem('currentUser'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('currentUser'));
  }, [location]);

  // Hide Navbar on login/signup page
  const hideNavbar = location.pathname === '/';

  return (
    <>
      {!hideNavbar && isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/parent" element={<ParentDashboard />} />
        <Route path="/dashboard/therapist" element={<TherapistDashboard />} />
        <Route path="/dashboard/organization" element={<OrganizationDashboard />} />
        <Route path="/learning-modules" element={<LearningModules />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/activities/english/mcq" element={<EnglishMCQ />} />
        <Route path="/activities/english/word-match" element={<EnglishWordMatch />} />
        <Route path="/activities/english/story-builder" element={<EnglishStoryBuilder />} />
        <Route path="/activities/math/mcq" element={<MathMCQ />} />
        <Route path="/activities/math/maze" element={<MathMaze />} />
        <Route path="/activities/math/number-puzzle" element={<MathNumberPuzzle />} />
        <Route path="/activities/logical/mcq" element={<LogicalMCQ />} />
        <Route path="/activities/logical/shape-match" element={<ShapeMatcher />} />
        <Route path="/activities/logical/sequence-game" element={<LogicalSequenceGame />} />
        <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
        <Route path="/emotion" element={<FaceEmotionDetector />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <ProgressProvider>
        <AppWrapper />
      </ProgressProvider>
    </Router>
  );
}

export default App;