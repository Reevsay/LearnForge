import axios from 'axios';

export const generateLearningPathContent = async (topic) => {
  try {
    const response = await axios.post('http://localhost:5000/api/ai/generate', { topic });
    console.log('Backend AI response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating learning path:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};