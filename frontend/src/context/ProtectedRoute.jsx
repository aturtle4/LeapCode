import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

// Component to protect routes that require authentication
const ProtectedRoute = ({ children, requireTeacher = false }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Check if the route requires teacher role
  if (requireTeacher && !user?.is_teacher) {
    return <Navigate to="/home" replace />;
  }

  // Render the protected component if authenticated and has correct role
  return children;
};

export default ProtectedRoute;
