// Helper functions for API requests
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to track if a token refresh is in progress
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue = [];

// Process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios.post('http://localhost:8000/api/v1/auth/refresh', {
      refresh_token: refreshToken
    });
    
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    return access_token;
  } catch (error) {
    // Clear tokens on refresh failure
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
};

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is not 401 or the request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Mark the request as retried to prevent infinite loops
    originalRequest._retry = true;
    
    // If a token refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }
    
    // Start the token refresh process
    isRefreshing = true;
    
    try {
      const newToken = await refreshAccessToken();
      
      // Update the header for the original request
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      
      // Process any queued requests with the new token
      processQueue(null, newToken);
      
      // Retry the original request with the new token
      return axios(originalRequest);
    } catch (refreshError) {
      // Process queue with error
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Auth API functions
export const authAPI = {
  // Login with email and password
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Store both access and refresh tokens
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Login failed' };
    }
  },

  // Register a new user
  register: async (userData) => {
    try {
      // Create proper request body as JSON
      const response = await api.post('/auth/signup', {
        email: userData.email,
        password: userData.password,
        username: userData.username,
        first_name: userData.firstName || "",
        last_name: userData.lastName || "",
        profile_picture: userData.profilePicture || ""
      });
      
      // Store both access and refresh tokens
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      
      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        throw error.response?.data || { detail: 'Registration failed - Email or username already exists' };
      }
      throw error.response?.data || { detail: 'Registration failed' };
    }
  },

  // Get Google auth URL
  getGoogleAuthUrl: async () => {
    try {
      const response = await api.get('/auth/google/auth');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get Google auth URL' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get user info' };
    }
  },

  // Check if user is authenticated (token exists and is valid)
  isAuthenticated: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return false;
      
      // Validate token by trying to get current user
      await authAPI.getCurrentUser();
      return true;
    } catch (error) {
      // Don't immediately remove token - refresh token flow will handle this
      return false;
    }
  },

  // Refresh access token using refresh token
  refreshToken: async () => {
    return refreshAccessToken();
  },

  // Logout (remove token)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export default api;