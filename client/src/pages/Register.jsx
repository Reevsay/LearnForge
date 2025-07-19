import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
        role: 'student',
      });
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      alert('Error registering user');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" fullWidth onClick={handleRegister} sx={{ mt: 2 }}>
        Register
      </Button>
      <Typography sx={{ mt: 2 }}>
        Already have an account? <Link to="/">Login</Link>
      </Typography>
    </Box>
  );
}

export default Register;