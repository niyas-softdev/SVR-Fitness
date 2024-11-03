import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode the token

const ProtectedRoute = ({ children, roles: allowedRoles }) => {
  const userToken = sessionStorage.getItem("userToken"); // Check if token exists

  if (!userToken) {
    return <Navigate to="/authpopup" />; // Redirect if not authenticated
  }

  try {
    const decodedToken = jwtDecode(userToken); // Decode the token to get user info
    const userRole = decodedToken.role; // Extract the user's role

    // Check if the user's role matches any of the allowed roles
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />; // Redirect if unauthorized
    }

    return children; // Render the protected component if role matches
  } catch (error) {
    console.error("Invalid token:", error);
    sessionStorage.removeItem("userToken"); // Clear invalid token
    return <Navigate to="/authpopup" />; // Redirect to login
  }
};

export default ProtectedRoute;
