import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import AdminHome from "./AdminHome";
import Calendar from "./Calendar";
import Documents from "./Documents";
import Reports from "./Reports";
import ProductController from "./ProductController";
import UserController from "./UserController";
import ExpireUser from "./ExpireUser";

const DashboardRouter = () => (
  <Routes>
    <Route path="/" element={<DashboardLayout />}>
      {/* Define child routes inside DashboardLayout */}
      <Route index element={<AdminHome />} /> {/* Default page */}
      <Route path="productController" element={<ProductController />} />
      <Route path="userController" element={<UserController />} />
      <Route path="expireUser" element={<ExpireUser />} />
      <Route path="documents" element={<Documents />} />
      <Route path="reports" element={<Reports />} />
    </Route>
  </Routes>
);

export default DashboardRouter;
