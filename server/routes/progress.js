const express = require('express');
const authMiddleware = require('../middleware/auth');
const { Progress } = require('../models');
const router = express.Router();

// Create or update progress
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { learningPathId, module, completion } = req.body;
    
    if (!learningPathId || !module || completion === undefined) {
      return res.status(400).json({ error: 'learningPathId, module, and completion are required' });
    }

    // Check if progress already exists for this user, learning path, and module
    const existingProgress = await Progress.findOne({
      where: {
        userId: req.user.id,
        learningPathId,
        module
      }
    });

    let progress;
    if (existingProgress) {
      // Update existing progress
      existingProgress.completion = completion;
      progress = await existingProgress.save();
    } else {
      // Create new progress record
      progress = await Progress.create({
        userId: req.user.id,
        learningPathId,
        module,
        completion
      });
    }

    res.json(progress);
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Error saving progress', details: error.message });
  }
});

// Get progress for a specific learning path
router.get('/:learningPathId', authMiddleware, async (req, res) => {
  try {
    const { learningPathId } = req.params;
    
    const progress = await Progress.findAll({
      where: {
        userId: req.user.id,
        learningPathId
      },
      order: [['module', 'ASC']]
    });

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Error fetching progress', details: error.message });
  }
});

// Get all progress for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.findAll({
      where: {
        userId: req.user.id
      },
      include: [{
        model: require('./LearningPath'),
        attributes: ['title', 'description']
      }],
      order: [['updatedAt', 'DESC']]
    });

    res.json(progress);
  } catch (error) {
    console.error('Error fetching all progress:', error);
    res.status(500).json({ error: 'Error fetching progress', details: error.message });
  }
});

// Delete progress for a specific module
router.delete('/:learningPathId/:module', authMiddleware, async (req, res) => {
  try {
    const { learningPathId, module } = req.params;
    
    const deleted = await Progress.destroy({
      where: {
        userId: req.user.id,
        learningPathId,
        module
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.json({ message: 'Progress deleted successfully' });
  } catch (error) {
    console.error('Error deleting progress:', error);
    res.status(500).json({ error: 'Error deleting progress', details: error.message });
  }
});

module.exports = router;
