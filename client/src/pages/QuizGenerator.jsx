import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './QuizGenerator.css';
import { generateAIContent } from '../services/ai';

function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [detailedResults, setDetailedResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerActive, setTimerActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const savedQuizzes = localStorage.getItem('generatedQuizzes');
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    }
  }, [navigate]);

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic for the quiz');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Create a ${difficulty} level quiz about ${topic} with ${questionCount} multiple choice questions`;
      const content = await generateAIContent('quiz', topic, prompt);
      
      const newQuiz = {
        id: Date.now(),
        topic,
        difficulty,
        questionCount,
        questions: content.questions || [],
        createdAt: new Date().toLocaleDateString(),
        completed: false
      };
      
      const updatedQuizzes = [...quizzes, newQuiz];
      setQuizzes(updatedQuizzes);
      localStorage.setItem('generatedQuizzes', JSON.stringify(updatedQuizzes));
      
      setTopic('');
      alert('Quiz generated successfully!');
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setShowResults(false);
    setScore(0);
    setTimeLeft(quiz.questions.length * 60);
    setTimerActive(true);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setTimerActive(false);
    let correct = 0;
    const results = [];
    
    activeQuiz.questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      const isCorrect = userAnswer === question.correct_answer;
      if (isCorrect) correct++;
      
      results.push({
        question: question.question,
        userAnswer: userAnswer || 'Not answered',
        correctAnswer: question.correct_answer,
        isCorrect: isCorrect,
        explanation: question.explanation || 'No explanation available',
        options: question.options
      });
    });
    
    const finalScore = Math.round((correct / activeQuiz.questions.length) * 100);
    setScore(finalScore);
    setDetailedResults(results);
    setQuizCompleted(true);
    setShowResults(true);
    
    const updatedQuizzes = quizzes.map(quiz => 
      quiz.id === activeQuiz.id ? { ...quiz, completed: true, lastScore: finalScore } : quiz
    );
    setQuizzes(updatedQuizzes);
    localStorage.setItem('generatedQuizzes', JSON.stringify(updatedQuizzes));
  };

  const handleDeleteQuiz = (id) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
    setQuizzes(updatedQuizzes);
    localStorage.setItem('generatedQuizzes', JSON.stringify(updatedQuizzes));
  };

  const handleBackToDashboard = () => {
    setActiveQuiz(null);
    setTimerActive(false);
    setShowResults(false);
  };

  const progress = activeQuiz ? ((currentQuestion + 1) / activeQuiz.questions.length) * 100 : 0;

  if (showResults) {
    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <div className="results-header">
            <div className="results-icon">
              {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
            </div>
            <h1>Quiz Completed!</h1>
            <div className="score-display">
              <div className="score-circle">
                <div className="score-number">{score}%</div>
              </div>
            </div>
          </div>
          
          <div className="results-summary">
            <div className="summary-item">
              <span className="summary-label">Questions Answered</span>
              <span className="summary-value">{Object.keys(selectedAnswers).length} / {activeQuiz.questions.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Correct Answers</span>
              <span className="summary-value">{Math.round(score * activeQuiz.questions.length / 100)} / {activeQuiz.questions.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Time Taken</span>
              <span className="summary-value">{formatTime((activeQuiz.questions.length * 60) - timeLeft)}</span>
            </div>
          </div>

          <div className="results-actions">
            <button className="btn-primary" onClick={() => handleStartQuiz(activeQuiz)}>
              Retake Quiz
            </button>
            <button className="btn-secondary" onClick={handleBackToDashboard}>
              Back to Quizzes
            </button>
          </div>

          {/* Detailed Results */}
          <div className="detailed-results">
            <h2>Detailed Results</h2>
            <div className="results-list">
              {detailedResults.map((result, index) => (
                <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-header">
                    <span className="question-number">Question {index + 1}</span>
                    <span className={`result-badge ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                      {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  
                  <div className="result-question">
                    <h4>{result.question}</h4>
                  </div>
                  
                  <div className="result-answers">
                    <div className="answer-row">
                      <span className="answer-label">Your Answer:</span>
                      <span className={`answer-value ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                        {result.userAnswer}
                      </span>
                    </div>
                    {!result.isCorrect && (
                      <div className="answer-row">
                        <span className="answer-label">Correct Answer:</span>
                        <span className="answer-value correct">{result.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                  
                  {result.explanation && (
                    <div className="result-explanation">
                      <h5>Explanation:</h5>
                      <p>{result.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    const question = activeQuiz.questions[currentQuestion];
    
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-info">
            <h2>{activeQuiz.topic}</h2>
            <span className="quiz-difficulty">{activeQuiz.difficulty}</span>
          </div>
          <div className="quiz-timer">
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
          <button className="btn-exit" onClick={handleBackToDashboard}>
            Exit Quiz
          </button>
        </div>

        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${progress}%`}}></div>
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {activeQuiz.questions.length}
          </span>
        </div>

        <div className="quiz-content">
          <div className="question-card">
            <div className="question-number">Q{currentQuestion + 1}</div>
            <h3 className="question-text">{question?.question}</h3>
            
            <div className="options-container">
              {question?.options?.map((option, index) => (
                <label key={index} className={`option-label ${selectedAnswers[currentQuestion] === option ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={selectedAnswers[currentQuestion] === option}
                    onChange={() => handleAnswerSelect(currentQuestion, option)}
                  />
                  <span className="option-text">{option}</span>
                  <span className="option-check">✓</span>
                </label>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button 
              className="btn-nav" 
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>
            
            {currentQuestion === activeQuiz.questions.length - 1 ? (
              <button className="btn-submit" onClick={handleSubmitQuiz}>
                Submit Quiz
              </button>
            ) : (
              <button 
                className="btn-nav primary" 
                onClick={handleNextQuestion}
                disabled={!selectedAnswers[currentQuestion]}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-generator-container">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">🧠</div>
            <span className="logo-text">SmartLearn</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/learning-path" className="nav-link">Learning Paths</Link>
            <Link to="/quiz-generator" className="nav-link active">Quiz Generator</Link>
            <Link to="/resources" className="nav-link">Resources</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <button className="btn-logout" onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="quiz-header-section">
        <div className="container">
          <div className="header-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <Link to="/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Quiz Generator</span>
            </div>
            <h1 className="page-title">AI Quiz Generator</h1>
            <p className="page-description">
              Create personalized quizzes on any topic using our advanced AI technology. 
              Test your knowledge and track your progress with intelligent assessments.
            </p>
          </div>
        </div>
      </section>

      <section className="generator-section">
        <div className="container">
          <div className="generator-card">
            <div className="card-header">
              <h2>Create New Quiz</h2>
              <p>Generate a customized quiz tailored to your learning needs</p>
            </div>

            <div className="generator-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="topic">Quiz Topic</label>
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., JavaScript, Machine Learning, History..."
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty Level</label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="form-select"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="questionCount">Number of Questions</label>
                  <select
                    id="questionCount"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="form-select"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                  </select>
                </div>
              </div>

              <button 
                className={`btn-generate ${loading ? 'loading' : ''}`}
                onClick={handleGenerateQuiz}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <span className="generate-icon">✨</span>
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {quizzes.length > 0 && (
        <section className="quizzes-section">
          <div className="container">
            <div className="section-header">
              <h2>Your Generated Quizzes</h2>
              <p>Take your quizzes and track your progress</p>
            </div>

            <div className="quizzes-grid">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-card">
                  <div className="quiz-card-header">
                    <div className="quiz-icon">🧩</div>
                    <div className="quiz-info">
                      <h3>{quiz.topic}</h3>
                      <div className="quiz-meta">
                        <span className="meta-item">
                          <span className="meta-icon">📊</span>
                          {quiz.difficulty}
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">❓</span>
                          {quiz.questions.length} Questions
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">📅</span>
                          {quiz.createdAt}
                        </span>
                      </div>
                    </div>
                    {quiz.completed && (
                      <div className="completion-badge">
                        <span className="check-icon">✅</span>
                        <span className="score-text">{quiz.lastScore || 0}%</span>
                      </div>
                    )}
                  </div>

                  <div className="quiz-actions">
                    <button 
                      className="btn-start"
                      onClick={() => handleStartQuiz(quiz)}
                    >
                      <span className="start-icon">▶️</span>
                      {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteQuiz(quiz.id)}
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

      {quizzes.length === 0 && (
        <section className="empty-section">
          <div className="container">
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No quizzes yet</h3>
              <p>Create your first AI-generated quiz to get started with learning!</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default QuizGenerator;
