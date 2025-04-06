// src/routes/UserRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileLayout from "../userProfile/profileLayout";
import ProfilePage from "../userProfile/profile";
import CartPage from "../pages/cartPage";
import OrderHistory from "../pages/OrderHistory";

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/profile" element={<ProfileLayout />}>
        <Route index element={<ProfilePage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orderHistory" element={<OrderHistory />} />
      </Route>
    </Routes>
  );
};

export default UserRouter;
