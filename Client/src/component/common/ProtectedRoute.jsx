import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/authpopup" />; // Redirect to login if not logged in
  }

  return children; // Render the children (protected components)
};

export default ProtectedRoute;
