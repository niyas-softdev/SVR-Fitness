import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminRouter from "./AdminRouter";
import UserRouter from "./UserRouter";
import MainLayout from "../layouts/mainLayout";
import Home from "../pages/Home";
import AuthPopup from "../common/AuthPopup";
import Unauthorized from "../pages/unauthorized";
import ProductPage from "../pages/productPage";
import CartPage from "../pages/cartPage";
import CheckoutPage from "../pages/checkoutPage";
import MembershipPage from "../pages/MembershipPage";
import WorkoutPlan from "../pages/workoutPlan";
import OrderHistory from "../pages/OrderHistory";
import ProtectedRoute from "../common/ProtectedRoute";
import axios from "axios";


const RoleBasedRouter = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      window.location.href = "/authpopup";
      return;
    }

    axios
      .get(`http://localhost:5174/api/profile/get/${userId}`, {
        headers: { userid: userId },
      })
      .then((res) => {
        if (res.data.success) {
          setRole(res.data.data.role);
        } else {
          window.location.href = "/authpopup";
        }
      })
      .catch(() => window.location.href = "/authpopup")
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Global Routes */}
      <Route path="/authpopup" element={<AuthPopup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Public layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute roles={["admin", "user"]}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/membership"
          element={
            <ProtectedRoute roles={["admin", "user"]}>
              <MembershipPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orderHistory"
          element={
            <ProtectedRoute roles={["admin", "user"]}>
              <OrderHistory />
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
      </Route>

      {/* Role-specific routes */}
      {role === "admin" && <Route path="/*" element={<AdminRouter />} />}
      {role === "user" && <Route path="/*" element={<UserRouter />} />}
    </Routes>
  );
};

export default RoleBasedRouter;
