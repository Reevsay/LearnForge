import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  TextField, 
  Typography, 
  LinearProgress, 
  IconButton,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Box,
  Alert
} from '@mui/material';
import { 
  Add, 
  Delete, 
  ExpandMore, 
  ExpandLess, 
  PlayArrow, 
  Refresh,
  Home
} from '@mui/icons-material';
import { aiAPI } from '../utils/api';
import { getUserFromToken } from '../utils/auth';

function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for the quiz');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Generating quiz for:', { topic });
      const response = await aiAPI.generateQuiz(topic);
      const quizData = parseQuizResponse(response);
      
      if (quizData && quizData.length > 0) {
        const newQuiz = {
          id: Date.now(),
          topic,
          title: `${topic} Quiz`,
          questions: quizData,
          createdAt: new Date().toISOString()
        };
        
        setQuizzes([newQuiz, ...quizzes]);
        setTopic('');
        setError('');
      } else {
        setError('Failed to generate quiz questions. Please try again.');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError('Failed to generate quiz. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseQuizResponse = (response) => {
    try {
      let quizText = response.candidates?.[0]?.output || response.output || '';
      
      // Clean up the response and parse JSON
      const cleanText = quizText
        .replace(/```json\n?|\n?```/g, '')
        .replace(/```\n?|\n?```/g, '')
        .trim();
      
      const parsedQuiz = JSON.parse(cleanText);
      return Array.isArray(parsedQuiz) ? parsedQuiz : [];
    } catch (parseError) {
      console.error('Parse error:', parseError);
      // Fallback: try to extract questions from text
      return extractQuestionsFromText(response.candidates?.[0]?.output || '');
    }
  };

  const extractQuestionsFromText = (text) => {
    // Fallback method to extract questions if JSON parsing fails
    const questions = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentQuestion = null;
    
    for (const line of lines) {
      if (line.match(/^\d+\./) || line.toLowerCase().includes('question')) {
        if (currentQuestion && currentQuestion.options.length === 4) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          question: line.replace(/^\d+\.\s*/, '').trim(),
          options: [],
          correctAnswer: 'A'
        };
      } else if (currentQuestion && line.match(/^[A-D][\.\)]/)) {
        const option = line.replace(/^[A-D][\.\)\s]*/, '').trim();
        currentQuestion.options.push(option);
      }
    }
    
    if (currentQuestion && currentQuestion.options.length === 4) {
      questions.push(currentQuestion);
    }
    
    return questions.slice(0, 10); // Limit to 10 questions
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setScore(0);
    setShowResults(false);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = () => {
    let correctAnswers = 0;
    activeQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setQuizCompleted(true);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setScore(0);
    setShowResults(false);
  };

  const deleteQuiz = (quizId) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    if (activeQuiz && activeQuiz.id === quizId) {
      resetQuiz();
    }
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return '#4ade80';
    if (percentage >= 60) return '#fbbf24';
    return '#ef4444';
  };

  const pageStyle = {
    backgroundColor: '#0a0a0a',
    color: 'white',
    minHeight: '100vh',
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '12px',
    marginBottom: '20px'
  };

  // Quiz Taking Interface
  if (activeQuiz && !showResults) {
    const question = activeQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / activeQuiz.questions.length) * 100;

    return (
      <div style={pageStyle}>
        <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ color: '#4ade80', fontWeight: 'bold' }}>
              {activeQuiz.title}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Home />}
              onClick={resetQuiz}
              sx={{ color: '#4ade80', borderColor: '#4ade80' }}
            >
              Back to Quiz List
            </Button>
          </Box>

          <Card sx={cardStyle}>
            <CardContent sx={{ color: 'white' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Question {currentQuestion + 1} of {activeQuiz.questions.length}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    backgroundColor: '#333', 
                    '& .MuiLinearProgress-bar': { backgroundColor: '#4ade80' } 
                  }} 
                />
              </Box>

              <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.6 }}>
                {question.question}
              </Typography>

              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={selectedAnswers[currentQuestion] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                >
                  {question.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={String.fromCharCode(65 + index)} // A, B, C, D
                      control={<Radio sx={{ color: '#4ade80', '&.Mui-checked': { color: '#4ade80' } }} />}
                      label={
                        <Box sx={{ p: 1 }}>
                          <Typography variant="body1">
                            <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        backgroundColor: selectedAnswers[currentQuestion] === String.fromCharCode(65 + index) 
                          ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
                        margin: '8px 0',
                        borderRadius: '8px',
                        border: selectedAnswers[currentQuestion] === String.fromCharCode(65 + index) 
                          ? '1px solid #4ade80' : '1px solid transparent',
                        '&:hover': { backgroundColor: 'rgba(74, 222, 128, 0.05)' }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  sx={{ color: '#4ade80', borderColor: '#4ade80' }}
                >
                  Previous
                </Button>
                
                <Button
                  variant="contained"
                  onClick={nextQuestion}
                  disabled={!selectedAnswers[currentQuestion]}
                  sx={{ 
                    backgroundColor: '#4ade80', 
                    color: 'black',
                    '&:hover': { backgroundColor: '#22c55e' },
                    '&:disabled': { backgroundColor: '#333' }
                  }}
                >
                  {currentQuestion === activeQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </div>
    );
  }

  // Results Interface
  if (showResults) {
    const percentage = (score / activeQuiz.questions.length) * 100;
    
    return (
      <div style={pageStyle}>
        <Box sx={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Card sx={cardStyle}>
            <CardContent sx={{ color: 'white', p: 4 }}>
              <Typography variant="h4" sx={{ color: '#4ade80', mb: 2 }}>
                Quiz Complete!
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h2" sx={{ 
                  color: getScoreColor(score, activeQuiz.questions.length),
                  mb: 1 
                }}>
                  {score}/{activeQuiz.questions.length}
                </Typography>
                <Typography variant="h6" sx={{ color: '#ccc' }}>
                  {percentage.toFixed(1)}% Correct
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                {percentage >= 80 && (
                  <Alert severity="success" sx={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }}>
                    Excellent work! You've mastered this topic.
                  </Alert>
                )}
                {percentage >= 60 && percentage < 80 && (
                  <Alert severity="warning" sx={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
                    Good job! You have a solid understanding.
                  </Alert>
                )}
                {percentage < 60 && (
                  <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                    Keep studying! Review the topic and try again.
                  </Alert>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={() => startQuiz(activeQuiz)}
                  sx={{ 
                    backgroundColor: '#4ade80', 
                    color: 'black',
                    '&:hover': { backgroundColor: '#22c55e' }
                  }}
                >
                  Retake Quiz
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={resetQuiz}
                  sx={{ color: '#4ade80', borderColor: '#4ade80' }}
                >
                  Back to Quiz List
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </div>
    );
  }

  // Main Quiz Generator Interface
  return (
    <div style={pageStyle}>
      <Box sx={{ maxWidth: 1000, margin: '0 auto' }}>
        <Typography variant="h4" sx={{ color: '#4ade80', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          AI Quiz Generator
        </Typography>

        {/* Quiz Generation Form */}
        <Card sx={cardStyle}>
          <CardContent sx={{ color: 'white' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Generate New Quiz
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
              <TextField
                label="Quiz Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., JavaScript Fundamentals, World History, Biology..."
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#4ade80' },
                    '&.Mui-focused fieldset': { borderColor: '#4ade80' }
                  },
                  '& .MuiInputLabel-root': { color: '#ccc' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4ade80' }
                }}
              />
              
              <Button
                variant="contained"
                onClick={handleGenerateQuiz}
                disabled={loading || !topic.trim()}
                startIcon={<Add />}
                sx={{ 
                  backgroundColor: '#4ade80', 
                  color: 'black',
                  minWidth: '140px',
                  height: '56px',
                  '&:hover': { backgroundColor: '#22c55e' },
                  '&:disabled': { backgroundColor: '#333' }
                }}
              >
                {loading ? 'Generating...' : 'Generate Quiz'}
              </Button>
            </Box>
            
            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress sx={{ 
                  backgroundColor: '#333', 
                  '& .MuiLinearProgress-bar': { backgroundColor: '#4ade80' } 
                }} />
                <Typography variant="body2" sx={{ mt: 1, color: '#ccc' }}>
                  AI is generating your quiz questions...
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Generated Quizzes */}
        {quizzes.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ color: '#4ade80', mb: 3 }}>
              Your Quizzes ({quizzes.length})
            </Typography>
            
            {quizzes.map((quiz) => (
              <Card key={quiz.id} sx={cardStyle}>
                <CardContent sx={{ color: 'white' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{quiz.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => startQuiz(quiz)}
                        sx={{ 
                          backgroundColor: '#4ade80', 
                          color: 'black',
                          '&:hover': { backgroundColor: '#22c55e' }
                        }}
                      >
                        Start Quiz
                      </Button>
                      
                      <IconButton
                        onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                        sx={{ color: '#4ade80' }}
                      >
                        {expandedQuiz === quiz.id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                      
                      <IconButton
                        onClick={() => deleteQuiz(quiz.id)}
                        sx={{ color: '#ef4444' }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
                    {quiz.questions.length} questions • Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </Typography>
                  
                  {expandedQuiz === quiz.id && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: '#0a0a0a', borderRadius: '8px' }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: '#4ade80' }}>
                        Questions Preview:
                      </Typography>
                      {quiz.questions.slice(0, 3).map((question, index) => (
                        <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #333' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {index + 1}. {question.question}
                          </Typography>
                          <Box sx={{ pl: 2 }}>
                            {question.options.map((option, optIndex) => (
                              <Typography key={optIndex} variant="body2" sx={{ color: '#ccc', fontSize: '0.9rem' }}>
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      ))}
                      {quiz.questions.length > 3 && (
                        <Typography variant="body2" sx={{ color: '#ccc', fontStyle: 'italic' }}>
                          ... and {quiz.questions.length - 3} more questions
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {quizzes.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#ccc', mb: 2 }}>
              No quizzes generated yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Enter a topic above to generate your first AI-powered quiz!
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default QuizGenerator;
