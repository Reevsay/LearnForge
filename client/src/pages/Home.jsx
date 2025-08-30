import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserFromToken, removeToken } from '../utils/auth';
import './Home.css';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check if user is logged in
    const userData = getUserFromToken();
    if (userData) {
      setUser(userData);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/learning-path');
    } else {
      navigate('/register');
    }
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    // Stay on home page after logout
  };

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">🧠</div>
            <span className="logo-text">SmartLearn</span>
          </div>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/learning-path" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Learning Paths
            </Link>
            <Link to="/quiz-generator" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Quiz Generator
            </Link>
            <Link to="/resources" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Resources
            </Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className="nav-buttons">
              {user ? (
                <>
                  <span className="user-welcome">Welcome, {user.name || user.username}!</span>
                  <Link to="/dashboard" className="btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button className="btn-primary" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <button className="btn-primary" onClick={handleGetStarted}>
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>Powered by AI Technology</span>
            </div>
            
            <h1 className="hero-title">
              {user ? (
                <>
                  Welcome back,
                  <br />
                  <span className="gradient-text">{user.name || user.username}!</span>
                </>
              ) : (
                <>
                  Transform Your Learning
                  <br />
                  <span className="gradient-text">with Smart AI</span>
                </>
              )}
            </h1>
            
            <p className="hero-description">
              {user ? (
                "Ready to continue your learning journey? Explore your personalized learning paths, take quizzes, and discover new resources tailored just for you."
              ) : (
                "Create personalized learning paths and interactive quizzes powered by artificial intelligence. Experience the future of education with our innovative platform that adapts to your learning style."
              )}
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">5+</div>
                <div className="stat-label">Learning Categories</div>
              </div>
              <div className="stat">
                <div className="stat-number">AI</div>
                <div className="stat-label">Powered Platform</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Available Access</div>
              </div>
            </div>
            
            <div className="hero-buttons">
              <button className="btn-primary large" onClick={handleGetStarted}>
                <span>{user ? "Continue Learning" : "Start Learning Now"}</span>
                <i className="arrow">→</i>
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="preview-title">SmartLearn Dashboard</div>
              </div>
              <div className="preview-content">
                <div className="learning-card">
                  <div className="card-icon">📚</div>
                  <div className="card-content">
                    <h4>Machine Learning Basics</h4>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '75%'}}></div>
                    </div>
                    <span className="progress-text">75% Complete</span>
                  </div>
                </div>
                <div className="learning-card">
                  <div className="card-icon">🧩</div>
                  <div className="card-content">
                    <h4>JavaScript Quiz</h4>
                    <div className="quiz-score">Score: 95%</div>
                    <span className="quiz-status">Completed</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="floating-elements">
              <div className="floating-card card-ai">
                <div className="card-icon">🤖</div>
                <span>AI Powered</span>
              </div>
              <div className="floating-card card-adaptive">
                <div className="card-icon">🎯</div>
                <span>Adaptive Learning</span>
              </div>
              <div className="floating-card card-analytics">
                <div className="card-icon">📊</div>
                <span>Smart Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>✨ Features</span>
            </div>
            <h2 className="section-title">Why Choose SmartLearn?</h2>
            <p className="section-description">
              Discover the powerful features that make learning more effective and engaging
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">🤖</div>
              </div>
              <h3>AI-Powered Learning</h3>
              <p>Generate personalized learning paths tailored to your unique learning style and goals using advanced AI algorithms.</p>
              <div className="feature-link">
                <Link to="/learning-path">Explore Learning Paths →</Link>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">🧩</div>
              </div>
              <h3>Interactive Quizzes</h3>
              <p>Test your knowledge with AI-generated quizzes that adapt to your progress and provide instant feedback.</p>
              <div className="feature-link">
                <Link to="/quiz-generator">Try Quiz Generator →</Link>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">📊</div>
              </div>
              <h3>Progress Analytics</h3>
              <p>Track your learning journey with detailed analytics, insights, and personalized recommendations.</p>
              <div className="feature-link">
                <Link to="/dashboard">View Dashboard →</Link>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">🎨</div>
              </div>
              <h3>Beautiful Interface</h3>
              <p>Enjoy a modern, intuitive design that makes learning engaging, fun, and easy to navigate.</p>
              <div className="feature-link">
                <Link to="/demo">See Interface →</Link>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">⚡</div>
              </div>
              <h3>Fast & Responsive</h3>
              <p>Experience lightning-fast performance with our optimized platform that works seamlessly across all devices.</p>
              <div className="feature-link">
                <span>Lightning Fast ⚡</span>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">🔒</div>
              </div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with enterprise-grade security and privacy measures you can trust.</p>
              <div className="feature-link">
                <span>Enterprise Security 🛡️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>🚀 Process</span>
            </div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Get started with SmartLearn in just three simple steps
            </p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Sign Up & Set Goals</h3>
                <p>Create your account and tell us about your learning objectives and preferences.</p>
              </div>
              <div className="step-icon">📝</div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>AI Creates Your Path</h3>
                <p>Our AI analyzes your goals and generates a personalized learning journey just for you.</p>
              </div>
              <div className="step-icon">🤖</div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Learn & Grow</h3>
                <p>Follow your customized path, take quizzes, and track your progress towards mastery.</p>
              </div>
              <div className="step-icon">🎓</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-gradient"></div>
        </div>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Learning Journey?</h2>
            <p>Join thousands of learners who are already achieving their goals with SmartLearn's AI-powered platform.</p>
            <div className="cta-buttons">
              <button className="btn-primary large" onClick={handleGetStarted}>
                <span>Start Learning Today</span>
                <i className="arrow">→</i>
              </button>
              <Link to="/contact" className="btn-outline large">
                <span>Contact Sales</span>
                <i className="phone-icon">📞</i>
              </Link>
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <span className="check-icon">✅</span>
                <span>Free Trial Available</span>
              </div>
              <div className="cta-feature">
                <span className="check-icon">✅</span>
                <span>No Credit Card Required</span>
              </div>
              <div className="cta-feature">
                <span className="check-icon">✅</span>
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">🧠</div>
                <span className="logo-text">SmartLearn</span>
              </div>
              <p className="footer-description">
                Empowering learners worldwide with AI-driven education technology that adapts to your unique learning style.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">💼</a>
                <a href="#" className="social-link">📷</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Platform</h4>
              <Link to="/learning-path">Learning Paths</Link>
              <Link to="/quiz-generator">Quiz Generator</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/resources">Resources</Link>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/press">Press</Link>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <Link to="/contact">Contact Us</Link>
              <Link to="/help">Help Center</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 SmartLearn. All rights reserved. Made with ❤️ for learners everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
