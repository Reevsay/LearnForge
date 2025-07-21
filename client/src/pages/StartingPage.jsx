import React from 'react';
  import { useNavigate } from 'react-router-dom';

  function StartingPage() {
    const navigate = useNavigate();

    const buttonStyle = {
      backgroundColor: 'transparent',
      border: '1px solid #4ade80',
      color: '#4ade80',
      padding: '12px 24px',
      fontSize: '1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    };

    const sectionStyle = {
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px',
    };

    const hoverBtn = (e) => {
      e.target.style.backgroundColor = '#4ade80';
      e.target.style.color = '#0a0a0a';
    };

    const resetBtn = (e) => {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.color = '#4ade80';
    };

    const handleStartWithAI = () => {
      navigate('/dashboard');
    };

    const handleGenerateQuiz = () => {
      navigate('/quiz-generator');
    };

    return (
      <div style={{ backgroundColor: '#0a0a0a', color: 'white', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px' }}>
        <div className="header" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>
            AI Learning Path Creator
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', lineHeight: 1.6, marginBottom: '30px' }}>
            Generate custom-tailored AI learning paths based on your goals. Just answer a few questions and get a structured roadmap with handpicked resources.
          </p>
          <div className="btn-container" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '60px' }}>
            <button className="btn" style={buttonStyle} onMouseOver={(e) => hoverBtn(e)} onMouseOut={(e) => resetBtn(e)} onClick={handleStartWithAI}>
              Start with AI
            </button>
            <button className="btn" style={buttonStyle} onMouseOver={(e) => hoverBtn(e)} onMouseOut={(e) => resetBtn(e)} onClick={handleGenerateQuiz}>
              Generate Quiz
            </button>
          </div>
        </div>

        <div className="content" style={{ width: '100%', maxWidth: '1100px', marginTop: '40px' }}>
          <div className="section" style={sectionStyle}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>How it Works</h2>
            <p style={{ color: '#ccc', lineHeight: 1.6 }}>
              Our smart AI analyzes your background and preferences to generate a personalized learning journey — complete with tutorials, projects, and recommended tools.
            </p>
          </div>
          <div className="section" style={sectionStyle}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Why Use It?</h2>
            <p style={{ color: '#ccc', lineHeight: 1.6 }}>
              No more guesswork or wasting time on irrelevant content. Whether you're a beginner or switching fields, we help you learn smarter and faster.
            </p>
          </div>
        </div>

        <div className="footer" style={{ textAlign: 'center', marginTop: '80px', fontSize: '0.9rem', color: '#777' }}>
          © 2025 AI Path Creator. All rights reserved.
        </div>
      </div>
    );
  }

  export default StartingPage;