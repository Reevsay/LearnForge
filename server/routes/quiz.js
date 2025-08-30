const express = require('express');
const { Quiz } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all quizzes for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get a specific quiz by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Create a new quiz
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, topic, questions } = req.body;

    if (!title || !topic || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ 
        error: 'Title, topic, and questions (array) are required' 
      });
    }

    const quiz = await Quiz.create({
      title,
      topic,
      questions: JSON.stringify(questions),
      userId: req.user.id,
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Update a quiz
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, topic, questions } = req.body;
    
    const quiz = await Quiz.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    await quiz.update({
      title: title || quiz.title,
      topic: topic || quiz.topic,
      questions: questions ? JSON.stringify(questions) : quiz.questions,
    });

    res.json(quiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// Delete a quiz
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    await quiz.destroy();
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

module.exports = router;
