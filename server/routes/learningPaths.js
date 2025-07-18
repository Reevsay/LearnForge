const express = require('express');
const authMiddleware = require('../middleware/auth');
const LearningPath = require('../models/LearningPath');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const learningPaths = await LearningPath.findAll({ where: { userId: req.user.id } });
    res.json(learningPaths);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learning paths' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    const learningPath = await LearningPath.create({
      title,
      description,
      userId: req.user.id,
      status: 'pending',
    });
    res.status(201).json(learningPath);
  } catch (error) {
    res.status(400).json({ message: 'Error creating learning path' });
  }
});

module.exports = router;