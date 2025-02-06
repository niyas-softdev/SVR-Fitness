import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileLayout from "./profileLayout"; // Layout component for profile
import ProfilePage from "./profile"; // Profile page
import CartPage from "../pages/cartPage"; // Cart page
// import OrdersPage from "./components/OrdersPage"; // Orders page (if needed)

const ProfileRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfileLayout />}>
        <Route index element={<ProfilePage />} /> {/* Default Profile Page */}
        <Route path="cart" element={<CartPage />} /> {/* Cart Page */}
        {/* <Route path="orders" element={<OrdersPage />} /> Orders Page */}
      </Route>
    </Routes>
  );
};

export default ProfileRouter;
