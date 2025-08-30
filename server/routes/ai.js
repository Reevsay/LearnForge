const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
const { getAISuggestion } = require('../controllers/aiController');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error('GEMINI_API_KEY is not set in .env');
const genAI = new GoogleGenerativeAI(API_KEY);

async function generateWithRetry(prompt, maxRetries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Switch to a stable model
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

router.post('/generate', async (req, res) => {
  console.log('Received AI request:', req.body);
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const suggestion = await generateWithRetry(prompt);
    console.log('Generated suggestion:', suggestion);
    res.json({ candidates: [{ output: suggestion }] });
  } catch (error) {
    console.error('Gemini API error:', error.message);
    res.status(500).json({ error: 'Failed to generate suggestion', details: error.message });
  }
});

module.exports = router;