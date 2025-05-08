// Helper functions for API requests
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility function for debouncing API calls
const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    const context = this;
    return new Promise((resolve, reject) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        try {
          const result = func.apply(context, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, wait);
    });
  };
};

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
      
      // Clear cached user data on login
      localStorage.removeItem('user_data');
      
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
        profile_picture: userData.profilePicture || "",
        is_teacher: userData.is_teacher || false
      });
      
      // Store both access and refresh tokens
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      
      // Clear cached user data on register
      localStorage.removeItem('user_data');
      
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

  // Get current user with caching
  getCurrentUser: async () => {
    try {
      // Check for cached user data to avoid unnecessary API calls
      const cachedUser = localStorage.getItem('user_data');
      const cachedTime = localStorage.getItem('user_data_timestamp');
      
      // Use cached data if it exists and is less than 5 minutes old
      if (cachedUser && cachedTime) {
        const now = new Date().getTime();
        const cacheAge = now - parseInt(cachedTime, 10);
        
        // Cache is valid for 5 minutes (300000 ms)
        if (cacheAge < 300000) {
          return JSON.parse(cachedUser);
        }
      }
      
      // If no valid cache, make the API call
      const response = await api.get('/auth/me');
      
      // Cache the response
      localStorage.setItem('user_data', JSON.stringify(response.data));
      localStorage.setItem('user_data_timestamp', new Date().getTime().toString());
      
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
      
      // Check for cached user data first
      const cachedUser = localStorage.getItem('user_data');
      const cachedTime = localStorage.getItem('user_data_timestamp');
      
      if (cachedUser && cachedTime) {
        const now = new Date().getTime();
        const cacheAge = now - parseInt(cachedTime, 10);
        
        // Cache is valid for 5 minutes (300000 ms)
        if (cacheAge < 300000) {
          return true;
        }
      }
      
      // If no valid cache, validate token by trying to get current user
      const response = await api.get('/auth/me');
      
      // Cache the successful response
      localStorage.setItem('user_data', JSON.stringify(response.data));
      localStorage.setItem('user_data_timestamp', new Date().getTime().toString());
      
      return true;
    } catch (error) {
      // Clear cached user data if authentication fails
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_data_timestamp');
      
      // Don't immediately remove token - refresh token flow will handle this
      return false;
    }
  },

  // Refresh access token using refresh token
  refreshToken: async () => {
    const result = await refreshAccessToken();
    
    // Clear cached user data on token refresh to force a fresh fetch
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_data_timestamp');
    
    return result;
  },

  // Logout (remove token and cached data)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_data_timestamp');
  }
};

export default api;