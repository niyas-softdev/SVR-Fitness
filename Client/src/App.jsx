import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./component/layouts/mainLayout"; // Import MainLayout
import BMICalculator from "./component/pages/bmiCalculator";
import WorkoutPlan from "./component/pages/workoutPlan";
import AuthPopup from "./component/common/authPopup";
import ProtectedRoute from "./component/common/ProtectedRoute";
import Unauthorized from "./component/pages/unauthorized";
import Home from "./component/pages/Home";
import ProductPage from "./component/pages/productPage";
import CartPage from "./component/pages/cartPage";
import DashboardRouter from "./component/admin pages/DashboardRouter";
import Footer from "./component/common/footer";
import ProfileRouter from "./component/userProfile/profileRouter";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wrap public routes inside MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<CartPage />} />

          <Route path="bmiCalculator" element={<ProtectedRoute roles={["admin"]}><BMICalculator /></ProtectedRoute>} />
          <Route path="workoutPlan" element={<ProtectedRoute roles={["admin", "user"]}><WorkoutPlan /></ProtectedRoute>} />
          <Route path="productPage" element={<ProtectedRoute roles={["admin", "user"]}><ProductPage /></ProtectedRoute>} />
        </Route>

        {/* Routes that don't use MainLayout */}
        <Route path="/authpopup" element={<AuthPopup />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
         <Route
          path="/profile/*"
          element={
            <ProtectedRoute roles={["admin","user"]}>
              <ProfileRouter />
            </ProtectedRoute>
          }
        />
     
      </Routes>
    </BrowserRouter>
  );
};

export default App;
