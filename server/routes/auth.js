const express = require('express');
      const router = express.Router();
      const passport = require('passport');
      const jwt = require('jsonwebtoken');

      router.post('/login', (req, res) => {
        const { email, password } = req.body;
        // Simulate user lookup (replace with actual DB query)
        if (email && password) {
          const token = jwt.sign({ id: 1, email, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.json({ token });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });

      router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

      router.get('/google/callback', 
        passport.authenticate('google', { failureRedirect: '/login' }),
        (req, res) => {
          const token = jwt.sign({ id: req.user.id, email: req.user.email, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.redirect(`http://localhost:5173/dashboard?token=${token}`);
        }
      );

      router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

      router.get('/github/callback', 
        passport.authenticate('github', { failureRedirect: '/login' }),
        (req, res) => {
          const token = jwt.sign({ id: req.user.id, email: req.user.email, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.redirect(`http://localhost:5173/dashboard?token=${token}`);
        }
      );

      router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
        res.json({ message: 'Protected route', user: req.user });
      });

      module.exports = router;