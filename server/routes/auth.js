const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working!' });
});

// Simple registration endpoint for testing
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, role } = req.body;
    
    console.log('Registration attempt:', { username, email, name, role });
    
    if (!username || !email || !password || !name) {
      return res.status(400).json({ error: 'Username, email, password, and name are required' });
    }

    // For now, just return success to test the frontend
    const token = jwt.sign(
      { id: Date.now(), email, username, name, role: role || 'student' }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User created successfully', 
      token,
      user: { id: Date.now(), username, email, name, role: role || 'student' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
});

// Simple login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // For testing, accept any login
    const token = jwt.sign(
      { id: 1, email, username: 'testuser', name: 'Test User', role: 'student' }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: { id: 1, username: 'testuser', email, name: 'Test User', role: 'student' }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, email: req.user.email, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:5174/dashboard?token=${token}`);
  }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, email: req.user.email, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:5174/dashboard?token=${token}`);
  }
);

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

module.exports = router;