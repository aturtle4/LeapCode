import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to load user data that can be called from anywhere
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const isAuth = await authAPI.isAuthenticated();
      if (isAuth) {
        const userData = await authAPI.getCurrentUser();
        console.log("Loaded user data:", userData); // Debug log
        setUser(userData);
        return userData;
      }
      return null;
    } catch (err) {
      console.error("Failed to load user:", err);
      setError(err.message || "Authentication failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user on mount and when pathname changes to /home
  useEffect(() => {
    // Track if the component is mounted
    let isMounted = true;
    let lastPathname = location.pathname;
    
    const fetchUser = async () => {
      if (isMounted) {
        // Always reload user data when navigating to home (after login/signup)
        if (location.pathname === "/home" && lastPathname !== "/home") {
          await loadUser();
        } else if (!user) {
          // Only load user on initial mount if not already loaded
          await loadUser();
        }
      }
    };
    
    fetchUser();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [location.pathname, loadUser]); // Removed user from dependencies

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(email, password);
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.detail || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(userData);
      const userInfo = await authAPI.getCurrentUser();
      setUser(userInfo);
      return userInfo;
    } catch (err) {
      setError(err.detail || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh token function - rarely needed but available
  const refreshTokens = async () => {
    try {
      setLoading(true);
      await authAPI.refreshToken();
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      return true;
    } catch (err) {
      // If refresh fails, log the user out
      setUser(null);
      navigate("/auth");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    navigate("/auth");
  };

  // Google authentication
  const googleAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.getGoogleAuthUrl();
      if (response && response.url) {
        window.location.href = response.url;
      } else {
        throw new Error("Failed to get Google authentication URL");
      }
    } catch (err) {
      setError(err.message || "Google authentication failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Value object with auth state and functions
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    googleAuth,
    refreshTokens,
    loadUser, // Expose the loadUser function to components
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
