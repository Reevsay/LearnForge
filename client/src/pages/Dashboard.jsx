import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Box,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  CardActions,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Quiz as QuizIcon,
  School as SchoolIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { generateAIContent } from '../services/ai';
import { getUserFromToken, removeToken } from '../utils/auth';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('learningPath');
  const [loading, setLoading] = useState(false);
  const [learningPaths, setLearningPaths] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [expandedPath, setExpandedPath] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();
    if (!user) {
      navigate('/login');
      return;
    }

    setUser(user);

    // Load saved data
    const savedPaths = localStorage.getItem('learningPaths');
    const savedQuizzes = localStorage.getItem('quizzes');
    
    if (savedPaths) {
      setLearningPaths(JSON.parse(savedPaths));
    }
    
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    }
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleCreateContent = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    setLoading(true);
    
    try {
      let content;
      
      if (contentType === 'learningPath') {
        content = await generateAIContent('learning_path', title, description);
        
        const newPath = {
          id: Date.now(),
          title,
          description,
          content,
          createdAt: new Date().toLocaleDateString(),
          expanded: false
        };
        
        const updatedPaths = [...learningPaths, newPath];
        setLearningPaths(updatedPaths);
        localStorage.setItem('learningPaths', JSON.stringify(updatedPaths));
      } else {
        content = await generateAIContent('quiz', title, description);
        
        const newQuiz = {
          id: Date.now(),
          title,
          description,
          questions: content.questions || [],
          createdAt: new Date().toLocaleDateString(),
          completed: false
        };
        
        const updatedQuizzes = [...quizzes, newQuiz];
        setQuizzes(updatedQuizzes);
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
      }
      
      setTitle('');
      setDescription('');
      alert(`${contentType === 'learningPath' ? 'Learning Path' : 'Quiz'} created successfully!`);
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePath = (id) => {
    const updatedPaths = learningPaths.filter(path => path.id !== id);
    setLearningPaths(updatedPaths);
    localStorage.setItem('learningPaths', JSON.stringify(updatedPaths));
  };

  const handleDeleteQuiz = (id) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
  };

  const handleToggleExpand = (id) => {
    setExpandedPath(expandedPath === id ? null : id);
  };

  const handleStartQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setQuizAnswers({});
    setShowResults(false);
    setQuizScore(0);
  };

  const handleQuizAnswer = (questionIndex, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;
    
    let correct = 0;
    currentQuiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / currentQuiz.questions.length) * 100);
    setQuizScore(score);
    setShowResults(true);
    
    // Mark quiz as completed
    const updatedQuizzes = quizzes.map(quiz => 
      quiz.id === currentQuiz.id ? { ...quiz, completed: true } : quiz
    );
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
  };

  const handleSharePath = (id) => {
    navigator.clipboard.writeText(`Learning Path ID: ${id}`);
    alert('Learning path ID copied to clipboard!');
  };

  if (currentQuiz && !showResults) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              {currentQuiz.title}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setCurrentQuiz(null)}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Exit Quiz
            </Button>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 4, color: '#ccc' }}>
            {currentQuiz.description}
          </Typography>
          
          {currentQuiz.questions.map((question, index) => (
            <Card key={index} sx={{ mb: 3, backgroundColor: '#2a2a2a' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                  {index + 1}. {question.question}
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={quizAnswers[index] || ''}
                    onChange={(e) => handleQuizAnswer(index, e.target.value)}
                  >
                    {question.options.map((option, optionIndex) => (
                      <FormControlLabel
                        key={optionIndex}
                        value={option}
                        control={<Radio sx={{ color: 'white' }} />}
                        label={<Typography sx={{ color: 'white' }}>{option}</Typography>}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          ))}
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(quizAnswers).length !== currentQuiz.questions.length}
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': { backgroundColor: '#45a049' }
              }}
            >
              Submit Quiz
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (showResults) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: 'white', textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
            Quiz Results
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h2" sx={{ color: quizScore >= 70 ? '#4caf50' : '#f44336', mb: 2 }}>
              {quizScore}%
            </Typography>
            <Typography variant="h6" sx={{ color: '#ccc' }}>
              You scored {Object.values(quizAnswers).filter((answer, index) => 
                answer === currentQuiz.questions[index].correct_answer
              ).length} out of {currentQuiz.questions.length} questions correctly
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => {
                setCurrentQuiz(null);
                setShowResults(false);
              }}
              sx={{ backgroundColor: '#2196f3' }}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleStartQuiz(currentQuiz)}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Retake Quiz
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ color: 'white' }}>
          Smart Learning Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ color: '#ccc' }}>
            Welcome, {user?.name || user?.username}!
          </Typography>
          <IconButton
            onClick={handleLogout}
            sx={{ color: 'white' }}
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Content Creation Section */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>
          Create New Content
        </Typography>
        
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ color: 'white', mb: 2 }}>
            What would you like to create?
          </FormLabel>
          <RadioGroup
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            row
          >
            <FormControlLabel
              value="learningPath"
              control={<Radio sx={{ color: 'white' }} />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon />
                  <Typography sx={{ color: 'white' }}>Learning Path</Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="quiz"
              control={<Radio sx={{ color: 'white' }} />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QuizIcon />
                  <Typography sx={{ color: 'white' }}>Quiz</Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#777' },
                  '&.Mui-focused fieldset': { borderColor: '#2196f3' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              multiline
              rows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#777' },
                  '&.Mui-focused fieldset': { borderColor: '#2196f3' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateContent}
              disabled={loading}
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': { backgroundColor: '#45a049' },
                '&:disabled': { backgroundColor: '#333' }
              }}
            >
              {loading ? 'Generating...' : `Create ${contentType === 'learningPath' ? 'Learning Path' : 'Quiz'}`}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Learning Paths Section */}
      {learningPaths.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon />
            Your Learning Paths
          </Typography>
          <Grid container spacing={2}>
            {learningPaths.map((path) => (
              <Grid item xs={12} md={6} lg={4} key={path.id}>
                <Card sx={{ backgroundColor: '#2a2a2a', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      {path.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
                      {path.description}
                    </Typography>
                    <Chip
                      label={path.createdAt}
                      size="small"
                      sx={{ backgroundColor: '#4caf50', color: 'white' }}
                    />
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleToggleExpand(path.id)}
                      sx={{ color: '#2196f3' }}
                    >
                      {expandedPath === path.id ? 'Hide' : 'View'}
                    </Button>
                    <IconButton
                      onClick={() => handleSharePath(path.id)}
                      sx={{ color: '#ccc' }}
                    >
                      <ShareIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeletePath(path.id)}
                      sx={{ color: '#f44336' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                  {expandedPath === path.id && (
                    <CardContent sx={{ pt: 0 }}>
                      <Typography variant="body2" sx={{ color: '#ddd' }}>
                        {path.content}
                      </Typography>
                    </CardContent>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Quizzes Section */}
      {quizzes.length > 0 && (
        <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuizIcon />
            Your Quizzes
          </Typography>
          <Grid container spacing={2}>
            {quizzes.map((quiz) => (
              <Grid item xs={12} md={6} lg={4} key={quiz.id}>
                <Card sx={{ backgroundColor: '#2a2a2a', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ color: 'white' }}>
                        {quiz.title}
                      </Typography>
                      {quiz.completed && (
                        <CheckCircleIcon sx={{ color: '#4caf50' }} />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
                      {quiz.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#bbb', mb: 2 }}>
                      {quiz.questions.length} questions
                    </Typography>
                    <Chip
                      label={quiz.createdAt}
                      size="small"
                      sx={{ backgroundColor: '#ff9800', color: 'white' }}
                    />
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleStartQuiz(quiz)}
                      startIcon={<PlayArrowIcon />}
                      sx={{ color: '#4caf50' }}
                    >
                      {quiz.completed ? 'Retake' : 'Start'}
                    </Button>
                    <IconButton
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      sx={{ color: '#f44336' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Empty State */}
      {learningPaths.length === 0 && quizzes.length === 0 && (
        <Paper sx={{ p: 4, backgroundColor: '#1a1a1a', border: '1px solid #333', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#ccc', mb: 2 }}>
            No content created yet
          </Typography>
          <Typography variant="body1" sx={{ color: '#888' }}>
            Use the form above to create your first learning path or quiz!
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default Dashboard;