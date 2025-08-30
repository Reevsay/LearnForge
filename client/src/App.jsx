import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StartingPage from './pages/StartingPage';
import Dashboard from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import QuizGenerator from './pages/QuizGenerator';
import Contact from './pages/Contact';
import Resources from './pages/Resources';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/starting" element={<StartingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/learning-path" element={<LearningPath />} />
      <Route path="/quiz-generator" element={<QuizGenerator />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/resources" element={<Resources />} />
    </Routes>
  );
}

export default App;