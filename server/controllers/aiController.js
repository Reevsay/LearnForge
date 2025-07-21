const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAISuggestion = async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Adjust model as needed
    const result = await model.generateContent(prompt);
    const response = result.response;
    res.json({ candidates: [{ output: response.text() }] });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
};

module.exports = { getAISuggestion };