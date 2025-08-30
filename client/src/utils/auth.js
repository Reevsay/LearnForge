/**
 * Authentication utilities for client-side
 */

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Set JWT token in localStorage
 * @param {string} token - JWT token to store
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} true if user has a valid token
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Check if token is expired (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

/**
 * Get user data from JWT token
 * @returns {object|null} User data or null if token is invalid
 */
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email,
      username: payload.username,
      name: payload.name,
      role: payload.role
    };
  } catch (error) {
    return null;
  }
};

/**
 * Create authorization headers for API requests
 * @returns {object} Headers object with Authorization
 */
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
