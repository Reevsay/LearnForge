const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
const { getAISuggestion } = require('../controllers/aiController');

const API_KEY = process.env.GEMINI_API_KEY;
console.log('🔑 Gemini API Configuration:');
console.log('- API Key exists:', !!API_KEY);
console.log('- API Key length:', API_KEY ? API_KEY.length : 0);
console.log('- API Key preview:', API_KEY ? `${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 5)}` : 'NOT SET');

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in .env file!');
  throw new Error('GEMINI_API_KEY is not set in .env');
}

const genAI = new GoogleGenerativeAI(API_KEY);
console.log('✅ GoogleGenerativeAI client initialized successfully');

async function generateWithRetry(prompt, maxRetries = 3, delay = 2000) {
  console.log('🚀 Starting AI generation with retry mechanism...');
  console.log('📝 Prompt preview:', prompt.substring(0, 100) + '...');
  console.log('🔄 Max retries:', maxRetries);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`\n🎯 Attempt ${attempt}/${maxRetries}:`);
    try {
      console.log('🔧 Initializing Gemini model (gemini-1.5-flash)...');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      console.log('📡 Sending request to Gemini API...');
      const startTime = Date.now();
      const result = await model.generateContent(prompt);
      const endTime = Date.now();
      
      console.log(`✅ Gemini API responded successfully in ${endTime - startTime}ms`);
      const responseText = result.response.text();
      console.log('📄 Response length:', responseText.length);
      console.log('📄 Response preview:', responseText.substring(0, 200) + '...');
      
      return responseText;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`);
      console.error('- Error type:', error.constructor.name);
      console.error('- Error message:', error.message);
      console.error('- Error code:', error.code || 'N/A');
      console.error('- Error status:', error.status || 'N/A');
      
      if (error.response) {
        console.error('- Response status:', error.response.status);
        console.error('- Response data:', error.response.data);
      }
      
      if (attempt === maxRetries) {
        console.error('💥 All retry attempts exhausted. Giving up.');
        throw error;
      }
      
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

router.post('/generate', async (req, res) => {
  const requestId = Date.now();
  console.log(`\n🎯 [${requestId}] New AI generation request received`);
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
  console.log('📨 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { prompt, topic, type } = req.body;
    
    // Validation
    if (!prompt) {
      console.error(`❌ [${requestId}] Missing prompt in request`);
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    console.log(`📝 [${requestId}] Processing request:`);
    console.log(`- Topic: ${topic || 'Not specified'}`);
    console.log(`- Type: ${type || 'Not specified'}`);
    console.log(`- Prompt length: ${prompt.length} characters`);
    
    console.log(`🚀 [${requestId}] Calling generateWithRetry...`);
    const suggestion = await generateWithRetry(prompt);
    
    console.log(`✅ [${requestId}] Generation completed successfully`);
    console.log(`📊 [${requestId}] Response stats:`);
    console.log(`- Length: ${suggestion.length} characters`);
    console.log(`- First 100 chars: ${suggestion.substring(0, 100)}...`);
    
    const response = { candidates: [{ output: suggestion }] };
    console.log(`📤 [${requestId}] Sending response to client`);
    
    res.json(response);
  } catch (error) {
    console.error(`💥 [${requestId}] Error in AI generation:`);
    console.error(`- Error type: ${error.constructor.name}`);
    console.error(`- Error message: ${error.message}`);
    console.error(`- Stack trace:`, error.stack);
    
    // Check for specific Gemini API errors
    if (error.message.includes('API_KEY')) {
      console.error(`🔑 [${requestId}] API Key related error - check your Gemini API key`);
    } else if (error.message.includes('quota')) {
      console.error(`📊 [${requestId}] Quota exceeded - check your Gemini API usage limits`);
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      console.error(`🌐 [${requestId}] Network error - check internet connection`);
    } else if (error.message.includes('safety')) {
      console.error(`🛡️ [${requestId}] Content safety filter triggered`);
    }
    
    res.status(500).json({ 
      error: 'Failed to generate suggestion', 
      details: error.message,
      requestId: requestId,
      timestamp: new Date().toISOString()
    });
  }
});

// Add a simple test endpoint
router.get('/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({ 
    message: 'AI service is working!', 
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

module.exports = router;