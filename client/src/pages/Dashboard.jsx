import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { generateLearningPathContent } from '../services/ai';

function Dashboard() {
  const [learningPaths, setLearningPaths] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/learning-paths', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLearningPaths(response.data);
      } catch (error) {
        console.error('Error fetching learning paths:', error);
        navigate('/');
      }
    };
    fetchLearningPaths();
  }, [navigate]);

  const handleCreateLearningPath = async () => {
    console.log('Button clicked, starting AI generation for:', title); // Debug log
    try {
      const token = localStorage.getItem('token');
      const aiContent = await generateLearningPathContent(title);
      console.log('AI content received:', aiContent); // Debug log
      const enhancedDescription = `${description}\nAI-Generated Content: ${aiContent}`;
      const response = await axios.post(
        'http://localhost:5000/api/learning-paths',
        { title, description: enhancedDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLearningPaths([...learningPaths, response.data]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating learning path:', error);
      alert('Error creating learning path. Check console for details.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Button
        variant="contained"
        onClick={handleCreateLearningPath} // Ensure this is correct
        sx={{ mb: 2 }}
      >
        Logout
      </Button>
      <Typography variant="h6">Create Learning Path</Typography>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button variant="contained" onClick={handleCreateLearningPath} sx={{ mt: 2 }}>
        Create with AI
      </Button>
      <Typography variant="h6" sx={{ mt: 4 }}>Your Learning Paths</Typography>
      <List>
        {learningPaths.map((path) => (
          <ListItem key={path.id}>
            <ListItemText primary={path.title} secondary={path.description} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Dashboard;