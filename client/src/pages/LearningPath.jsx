import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LearningPath.css';
import { generateAIContent } from '../services/ai';
import { getUserFromToken, removeToken } from '../utils/auth';

function LearningPath() {
  const [user, setUser] = useState(null);
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('beginner');
  const [duration, setDuration] = useState('4-weeks');
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getUserFromToken();
    if (!userData) {
      navigate('/login');
      return;
    }

    setUser(userData);

    // Load saved learning paths
    const savedPaths = localStorage.getItem('learningPaths');
    if (savedPaths) {
      setLearningPaths(JSON.parse(savedPaths));
    }
  }, [navigate]);

  const handleGeneratePath = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic for your learning path');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Create a comprehensive ${level} level learning path for ${topic} that spans ${duration}. 
      Include weekly milestones, resources, and practical projects. Format as a structured learning journey.`;
      
      const content = await generateAIContent('learningPath', topic, prompt);
      
      const newPath = {
        id: Date.now(),
        title: `${topic} Learning Path`,
        topic,
        level,
        duration,
        progress: 0,
        content: content.content || content.text || '',
        modules: generateModules(topic, level, duration),
        createdAt: new Date().toLocaleDateString(),
        completed: false
      };
      
      const updatedPaths = [...learningPaths, newPath];
      setLearningPaths(updatedPaths);
      localStorage.setItem('learningPaths', JSON.stringify(updatedPaths));
      
      setTopic('');
      alert('Learning path generated successfully!');
    } catch (error) {
      console.error('Error generating learning path:', error);
      alert('Failed to generate learning path. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateModules = (topic, level, duration) => {
    const weeks = parseInt(duration.split('-')[0]);
    const modules = [];
    
    for (let i = 1; i <= weeks; i++) {
      modules.push({
        id: i,
        title: `Week ${i}: ${getWeekTitle(topic, i, level)}`,
        description: getWeekDescription(topic, i, level),
        completed: false,
        lessons: [
          { id: 1, title: `Introduction to ${getWeekTitle(topic, i, level)}`, completed: false },
          { id: 2, title: `Practical Exercises`, completed: false },
          { id: 3, title: `Hands-on Project`, completed: false },
          { id: 4, title: `Review and Assessment`, completed: false }
        ]
      });
    }
    
    return modules;
  };

  const getWeekTitle = (topic, week, level) => {
    const titles = {
      1: `${topic} Fundamentals`,
      2: `Core Concepts`,
      3: `Intermediate Techniques`,
      4: `Advanced Applications`,
      5: `Real-world Projects`,
      6: `Optimization & Best Practices`,
      7: `Industry Standards`,
      8: `Capstone Project`
    };
    return titles[week] || `Advanced ${topic} Topics`;
  };

  const getWeekDescription = (topic, week, level) => {
    return `Master key concepts and practical skills in ${topic} through hands-on exercises and real-world projects.`;
  };

  const handleStartPath = (path) => {
    setSelectedPath(path);
  };

  const handleModuleComplete = (pathId, moduleId) => {
    const updatedPaths = learningPaths.map(path => {
      if (path.id === pathId) {
        const updatedModules = path.modules.map(module => {
          if (module.id === moduleId) {
            return { ...module, completed: !module.completed };
          }
          return module;
        });
        
        const completedModules = updatedModules.filter(m => m.completed).length;
        const progress = Math.round((completedModules / updatedModules.length) * 100);
        
        return { ...path, modules: updatedModules, progress };
      }
      return path;
    });
    
    setLearningPaths(updatedPaths);
    localStorage.setItem('learningPaths', JSON.stringify(updatedPaths));
  };

  const handleDeletePath = (id) => {
    const updatedPaths = learningPaths.filter(path => path.id !== id);
    setLearningPaths(updatedPaths);
    localStorage.setItem('learningPaths', JSON.stringify(updatedPaths));
  };

  if (selectedPath) {
    return (
      <div className="learning-path-container">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <div className="logo-icon">🧠</div>
              <span className="logo-text">SmartLearn</span>
            </Link>
            
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/learning-path" className="nav-link active">Learning Paths</Link>
              <Link to="/quiz-generator" className="nav-link">Quiz Generator</Link>
              <Link to="/resources" className="nav-link">Resources</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              <button className="btn-logout" onClick={() => {
                removeToken();
                navigate('/login');
              }}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="path-detail">
          <div className="container">
            <div className="path-header">
              <button className="btn-back" onClick={() => setSelectedPath(null)}>
                ← Back to Learning Paths
              </button>
              <h1>{selectedPath.title}</h1>
              <div className="path-meta">
                <span className="meta-item">📚 {selectedPath.level}</span>
                <span className="meta-item">⏰ {selectedPath.duration}</span>
                <span className="meta-item">📈 {selectedPath.progress}% Complete</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${selectedPath.progress}%`}}></div>
              </div>
            </div>

            <div className="modules-grid">
              {selectedPath.modules.map((module) => (
                <div key={module.id} className={`module-card ${module.completed ? 'completed' : ''}`}>
                  <div className="module-header">
                    <div className="module-icon">
                      {module.completed ? '✅' : '📚'}
                    </div>
                    <div className="module-info">
                      <h3>{module.title}</h3>
                      <p>{module.description}</p>
                    </div>
                    <button 
                      className="module-toggle"
                      onClick={() => handleModuleComplete(selectedPath.id, module.id)}
                    >
                      {module.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                  </div>
                  
                  <div className="lessons-list">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="lesson-item">
                        <span className="lesson-icon">📝</span>
                        <span className="lesson-title">{lesson.title}</span>
                        <span className="lesson-status">
                          {module.completed ? '✅' : '⏳'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-path-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
        <div className="grid-overlay"></div>
      </div>

      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">🧠</div>
            <span className="logo-text">SmartLearn</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/learning-path" className="nav-link active">Learning Paths</Link>
            <Link to="/quiz-generator" className="nav-link">Quiz Generator</Link>
            <Link to="/resources" className="nav-link">Resources</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <button className="btn-logout" onClick={() => {
              removeToken();
              navigate('/login');
            }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <Link to="/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Learning Paths</span>
            </div>
            
            <h1 className="page-title">
              AI-Powered Learning Path
              <br />
              <span className="gradient-text">Generator</span>
            </h1>
            
            <p className="page-description">
              Create personalized learning journeys with our advanced AI technology. 
              Get structured modules, progress tracking, and adaptive content tailored to your learning style.
            </p>

            {/* Stats Section */}
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-number">{learningPaths.length}</div>
                <div className="stat-label">Active Paths</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-number">AI</div>
                <div className="stat-label">Powered</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-number">100%</div>
                <div className="stat-label">Personalized</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="generator-section">
        <div className="container">
          <div className="generator-card">
            <div className="card-header">
              <h2>Create New Learning Path</h2>
              <p>Generate a customized learning journey with AI assistance</p>
            </div>

            <div className="generator-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="topic">What do you want to learn?</label>
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Machine Learning, Web Development, Data Science..."
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="level">Your Current Level</label>
                  <select
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="form-select"
                  >
                    <option value="beginner">Beginner - I'm just starting</option>
                    <option value="intermediate">Intermediate - I have some knowledge</option>
                    <option value="advanced">Advanced - I want to specialize</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Time Commitment</label>
                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="form-select"
                  >
                    <option value="2-weeks">2 Weeks - Quick Start</option>
                    <option value="4-weeks">4 Weeks - Standard</option>
                    <option value="6-weeks">6 Weeks - Comprehensive</option>
                    <option value="8-weeks">8 Weeks - Mastery</option>
                  </select>
                </div>
              </div>

              <button 
                className={`btn-generate ${loading ? 'loading' : ''}`}
                onClick={handleGeneratePath}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Generating Path...
                  </>
                ) : (
                  <>
                    <span className="generate-icon">✨</span>
                    Generate Learning Path
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {learningPaths.length > 0 && (
        <section className="paths-section">
          <div className="container">
            <div className="section-header">
              <h2>Your Learning Paths</h2>
              <p>Continue your learning journey or start a new path</p>
            </div>

            <div className="paths-grid">
              {learningPaths.map((path) => (
                <div key={path.id} className="path-card">
                  <div className="path-header">
                    <div className="path-icon">🎯</div>
                    <div className="path-info">
                      <h3>{path.title}</h3>
                      <div className="path-meta">
                        <span className="meta-item">📚 {path.level}</span>
                        <span className="meta-item">⏰ {path.duration}</span>
                        <span className="meta-item">📅 {path.createdAt}</span>
                      </div>
                    </div>
                    <div className="path-progress">
                      <div className="progress-circle">
                        <span>{path.progress}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${path.progress}%`}}></div>
                  </div>

                  <div className="path-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => handleStartPath(path)}
                    >
                      <span className="action-icon">📚</span>
                      {path.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeletePath(path.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {learningPaths.length === 0 && (
        <section className="empty-section">
          <div className="container">
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No learning paths yet</h3>
              <p>Create your first AI-generated learning path to get started!</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default LearningPath;
