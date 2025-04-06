// src/routes/AdminRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileLayout from "../../component/userProfile/profileLayout";
import AdminHome from "../../component/admin pages/AdminHome";
import ProductController from "../admin pages/productController";
import UserController from "../admin pages/UserController";
import ExpireUser from "../admin pages/ExpireUser";
import ProfilePage from "../userProfile/profile";

const AdminRouter = () => {
  return (
    <Routes>
    <Route path="/profile" element={<ProfileLayout />}>
      <Route index element={<ProfilePage />} /> {/* ✅ ProfilePage shown first */}
      <Route path="adminHome" element={<AdminHome />} />
      <Route path="productController" element={<ProductController />} />
      <Route path="userController" element={<UserController />} />
      <Route path="expireUser" element={<ExpireUser />} />
    </Route>
  </Routes>
  );
};

export default AdminRouter;
