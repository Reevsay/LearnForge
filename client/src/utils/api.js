/**
 * API service functions for making HTTP requests
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} API response
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Authentication API calls
 */
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (username, email, password, role = 'student') => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role }),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },
};

/**
 * Learning Path API calls
 */
export const learningPathAPI = {
  getAll: async () => {
    return apiRequest('/learning-paths');
  },

  create: async (title, description, content) => {
    return apiRequest('/learning-paths', {
      method: 'POST',
      body: JSON.stringify({ title, description, content }),
    });
  },

  getById: async (id) => {
    return apiRequest(`/learning-paths/${id}`);
  },

  update: async (id, data) => {
    return apiRequest(`/learning-paths/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/learning-paths/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * AI Generation API calls
 */
export const aiAPI = {
  generateContent: async (prompt, type = 'learning-path') => {
    return apiRequest('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, type }),
    });
  },

  generateQuiz: async (topic) => {
    const prompt = `Generate 5-10 multiple-choice questions based on the topic "${topic}". Each question should have 4 options (A, B, C, D) with one correct answer. Return the response as a JSON array of objects, where each object has: question (string), options (array of 4 strings), correctAnswer (string, e.g., 'A'). Format the JSON clearly.`;
    
    return apiRequest('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, type: 'quiz' }),
    });
  },
};

/**
 * Progress Tracking API calls
 */
export const progressAPI = {
  getProgress: async (pathId) => {
    return apiRequest(`/progress/${pathId}`);
  },

  updateProgress: async (learningPathId, completedModules, totalModules) => {
    return apiRequest('/progress', {
      method: 'POST',
      body: JSON.stringify({ learningPathId, completedModules, totalModules }),
    });
  },
};

/**
 * Quiz API calls
 */
export const quizAPI = {
  getById: async (id) => {
    return apiRequest(`/quiz/${id}`);
  },

  create: async (title, topic, questions) => {
    return apiRequest('/quiz', {
      method: 'POST',
      body: JSON.stringify({ title, topic, questions }),
    });
  },

  getAll: async () => {
    return apiRequest('/quiz');
  },
};
