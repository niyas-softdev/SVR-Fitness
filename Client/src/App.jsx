import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppNavbar from "./component/common/AppNavbar";
import GoogleLogin from "./component/pages/GoogleLogin";
import ProductController from "./component/pages/productController";
import NutritionForm from "./component/pages/nutritionFrom";
import NutritionList from "./component/pages/nutritionList";
import BMICalculator from "./component/pages/bmiCalculator";
import WorkoutPlan from "./component/pages/workoutPlan";
import AuthPopup from "./component/common/AuthPopup"; // Import AuthPopup
import ProtectedRoute from "./component/common/ProtectedRoute"; // Import ProtectedRoute

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

  const handleLogout = () => {
    setIsLoggedIn(false); // Clear login state
    // Add logic to clear tokens or sessions if necessary
  };

  return (
    <BrowserRouter>
      <AppNavbar
        isLoggedIn={isLoggedIn} // Pass login state to navbar
        handleLogout={handleLogout} // Pass logout handler
      />
      <Routes>
        {/* Route for AuthPopup */}
        <Route path="/authpopup" element={<AuthPopup />} /> {/* Route for AuthPopup */}
        
        <Route path="/login" element={<GoogleLogin />} />

        {/* Protected Routes */}
        <Route
          path="/productController"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ProductController />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutritionFrom"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <NutritionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutritionList"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <NutritionList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bmiCalculator"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <BMICalculator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workoutPlan"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <WorkoutPlan />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
