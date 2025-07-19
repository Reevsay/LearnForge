const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate', async (req, res) => {
  try {
    const { topic } = req.body;
    console.log('Requesting AI content for topic:', topic);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(`Generate a detailed learning path for ${topic}. Include 3 key modules with brief descriptions.`);
    const generatedText = result.response.text();
    console.log('Full API response:', generatedText);
    res.json(generatedText || 'No content generated');
  } catch (error) {
    console.error('Error generating learning path:', error.message);
    res.status(500).json({ message: 'Error generating learning path' });
  }
});

module.exports = router;