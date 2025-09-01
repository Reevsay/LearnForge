// Test script to verify Gemini API connectivity
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
console.log('🔍 Testing Gemini API Connection...');
console.log('API Key exists:', !!API_KEY);
console.log('API Key length:', API_KEY ? API_KEY.length : 0);

async function testGeminiAPI() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('📡 Sending test request to Gemini...');
    const result = await model.generateContent('Say hello in a friendly way!');
    const response = result.response.text();
    
    console.log('✅ Gemini API Test Successful!');
    console.log('Response:', response);
    return true;
  } catch (error) {
    console.error('❌ Gemini API Test Failed:');
    console.error('Error:', error.message);
    return false;
  }
}

testGeminiAPI();
