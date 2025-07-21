import React from 'react';
  import { Route, Routes } from 'react-router-dom';
  import Login from './pages/Login';
  import StartingPage from './pages/StartingPage';
  import Dashboard from './pages/Dashboard';
  import QuizGenerator from './pages/QuizGenerator';

  function App() {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/starting" element={<StartingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz-generator" element={<QuizGenerator />} />
      </Routes>
    );
  }

  export default App;