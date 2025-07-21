import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button, TextField, Typography, LinearProgress, IconButton } from '@mui/material';
    import { Add, Delete, ExpandMore, ExpandLess } from '@mui/icons-material';

    function QuizGenerator() {
      const [topic, setTopic] = useState('');
      const [quizzes, setQuizzes] = useState([]);
      const [loading, setLoading] = useState(false);
      const [expandedQuiz, setExpandedQuiz] = useState(null);
      const navigate = useNavigate();

      const handleGenerateQuiz = async () => {
        if (!topic.trim()) return;

        setLoading(true);
        try {
          console.log('Generating quiz for:', { topic });
          const quizData = await generateQuizFromGemini(topic);
          setQuizzes([{ id: Date.now(), topic, questions: quizData }]);
        } catch (error) {
          console.error('Error generating quiz:', error);
          alert('Failed to generate quiz. Check console for details.');
        } finally {
          setLoading(false);
        }
      };

      const generateQuizFromGemini = async (topic) => {
        const url = '/gemini-api';
        const prompt = `Generate 5-10 multiple-choice questions based on the topic "${topic}". Each question should have 4 options (A, B, C, D) with one correct answer. Return the response as a JSON array of objects, where each object has: question (string), options (array of 4 strings), correctAnswer (string, e.g., 'A'). Format the JSON clearly.`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const data = await response.json();
        const quizText = data.candidates?.[0]?.output || '[]';
        return JSON.parse(quizText.replace(/```json\n|\n```/g, '')); // Clean up potential markdown
      };

      const handleDeleteQuiz = (id) => {
        const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
        setQuizzes(updatedQuizzes);
      };

      const handleToggleExpand = (id) => {
        setExpandedQuiz(expandedQuiz === id ? null : id);
      };

      return (
        <div className="dashboard-container" style={{ backgroundColor: '#0a0a0a', color: 'white', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', minHeight: '100vh' }}>
          <div className="header" style={{ textAlign: 'center', maxWidth: '800px' }}>
            <Typography variant="h1" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>
              AI Quiz Generator
            </Typography>
            <Typography variant="body1" style={{ fontSize: '1.2rem', color: '#ccc', lineHeight: 1.6, marginBottom: '30px' }}>
              Generate a custom quiz based on your chosen topic using AI. Create and review your questions here.
            </Typography>
          </div>

          <div className="content" style={{ width: '100%', maxWidth: '1100px', marginTop: '40px' }}>
            <div className="section" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
              <Typography variant="h2" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Generate Quiz</Typography>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <TextField
                  label="Topic"
                  fullWidth
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: '#4ade80' } }}
                  style={{ backgroundColor: '#111', borderRadius: '8px' }}
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleGenerateQuiz}
                  style={{ backgroundColor: '#4ade80', color: '#0a0a0a', padding: '12px 24px', fontSize: '1rem', borderRadius: '8px', transition: 'all 0.3s ease' }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#38ef7d')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#4ade80')}
                  disabled={!topic.trim() || loading}
                >
                  {loading ? 'Generating...' : 'Generate Quiz'}
                </Button>
              </div>
            </div>

            <div className="section" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
              <Typography variant="h2" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Your Generated Quizzes</Typography>
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <div key={quiz.id} style={{ backgroundColor: '#111', borderRadius: '8px', padding: '16px', marginBottom: '12px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body1" style={{ fontWeight: 600 }}>Quiz: {quiz.topic}</Typography>
                      <div>
                        <IconButton onClick={() => handleToggleExpand(quiz.id)} style={{ color: '#4ade80', marginRight: '10px' }}>
                          {expandedQuiz === quiz.id ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                        <IconButton onClick={() => handleDeleteQuiz(quiz.id)} style={{ color: '#ff4444' }}>
                          <Delete />
                        </IconButton>
                      </div>
                    </div>
                    {expandedQuiz === quiz.id && (
                      <div style={{ marginTop: '12px', paddingLeft: '20px' }}>
                        <Typography variant="caption" style={{ color: '#4ade80', display: 'block', marginBottom: '8px' }}>Questions:</Typography>
                        {quiz.questions.map((q, index) => (
                          <div key={index} style={{ marginBottom: '16px', color: '#ccc' }}>
                            <Typography variant="body2" style={{ fontWeight: 600 }}>{index + 1}. {q.question}</Typography>
                            {q.options.map((option, i) => (
                              <Typography key={i} variant="body2" style={{ marginLeft: '20px' }}>
                                {String.fromCharCode(65 + i)}. {option} {q.correctAnswer === String.fromCharCode(65 + i) ? '(Correct)' : ''}
                              </Typography>
                            ))}
                          </div>
                        ))}
                        <Typography variant="caption" style={{ color: '#4ade80', display: 'block', marginTop: '16px' }}>Answer Key:</Typography>
                        <div style={{ color: '#ccc', marginLeft: '20px' }}>
                          {quiz.questions.map((q, index) => (
                            <Typography key={index} variant="body2">
                              {index + 1}. {q.question} - Correct Answer: {q.correctAnswer} ({q.options[parseInt(q.correctAnswer.charCodeAt(0) - 65)]})
                            </Typography>
                          ))}
                        </div>
                      </div>
                    )}
                    <LinearProgress variant="determinate" value={0} style={{ marginTop: '12px', backgroundColor: '#333' }} /> {/* Placeholder progress */}
                  </div>
                ))
              ) : (
                <Typography variant="body2" style={{ color: '#ccc', textAlign: 'center', marginTop: '16px' }}>No quizzes yet! Enter a topic and generate one. 🚀</Typography>
              )}
            </div>
          </div>

          <div className="footer" style={{ textAlign: 'center', marginTop: '80px', fontSize: '0.9rem', color: '#777' }}>
            © 2025 AI Path Creator. All rights reserved.
          </div>
        </div>
      );
    }

    export default QuizGenerator;
    