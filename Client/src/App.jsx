import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppNavbar from "./component/common/AppNavbar";
import BMICalculator from "./component/pages/bmiCalculator";
import WorkoutPlan from "./component/pages/workoutPlan";
import AuthPopup from "./component/common/authPopup";
import ProtectedRoute from "./component/common/ProtectedRoute";
import Profile from "./component/pages/profile";
import Unauthorized from "./component/pages/unauthorized";
import Home from "./component/pages/Home";
import DashboardRouter from "./component/admin pages/DashboardRouter";
import ProductPage from "./component/pages/productPage";
import CartPage from "./component/pages/cartPage";
import Footer from "./component/pages/footer";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/authpopup" element={<AuthPopup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<CartPage />} />;
        <Route path="/footer" element={<Footer />} />

       
        <Route
          path="/bmiCalculator"
          element={
            <ProtectedRoute roles={["admin"]}>
              <BMICalculator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workoutPlan"
          element={
            <ProtectedRoute roles={["admin", "user"]}>
              <WorkoutPlan />
            </ProtectedRoute>
          }
        />

<Route
          path="/productPage"
          element={
            <ProtectedRoute roles={["admin", "user"]}>
              <ProductPage />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Routes with Nested Pages */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
