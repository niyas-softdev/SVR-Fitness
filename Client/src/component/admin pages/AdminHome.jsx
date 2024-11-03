import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API
});

const AdminHome = () => {
  const [userCount, setUserCount] = useState(0);
  const [expiredUserCount, setExpiredUserCount] = useState(0); // Expired user count
  const [productCount, setProductCount] = useState(0);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("userToken");

      if (!token) {
        console.error("No token found! Ensure you're logged in.");
        return;
      }

      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      if (userRole !== "admin") {
        console.error("Access denied. User is not an admin.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, productsRes, expiredUsersRes] = await Promise.all([
        axiosInstance.get("/api/user/userCount", { headers }),
        axiosInstance.get("/api/product/productCount", { headers }),
        axiosInstance.get("/api/user/getExpiredUserCount", { headers }) // Endpoint to fetch expired user count
      ]);

      setUserCount(usersRes.data.count || 0);
      setProductCount(productsRes.data.productCount || 0);
      setExpiredUserCount(expiredUsersRes.data.expiredCount || 0); // Set expired user count
    } catch (error) {
      if (error.response) {
        console.error(
          `Error: ${error.response.status} - ${error.response.statusText}`
        );
      } else {
        console.error("Error fetching data:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const doughnutData = {
    labels: ["Users", "Products", "Expired Users"],
    datasets: [
      {
        label: "Count",
        data: [userCount, productCount, expiredUserCount],
        backgroundColor: ["#4F46E5", "#F59E0B", "#EF4444"],
        borderWidth: 1
      }
    ]
  };

  const barData = {
    labels: ["Users", "Products", "Expired Users"],
    datasets: [
      {
        label: "Count",
        data: [userCount, productCount, expiredUserCount],
        backgroundColor: ["#4F46E5", "#F59E0B", "#EF4444"]
      }
    ]
  };

  return (
    <div className="p-8 bg-black min-h-screen">
  <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    {/* Total Users */}
    <div className="bg-white/10 backdrop-blur-lg shadow-lg rounded-lg p-6 border border-white/20">
      <h2 className="text-lg font-semibold text-gray-300">Total Users</h2>
      <p className="text-4xl font-bold text-indigo-400">{userCount}</p>
    </div>

    {/* Total Products */}
    <div className="bg-white/10 backdrop-blur-lg shadow-lg rounded-lg p-6 border border-white/20">
      <h2 className="text-lg font-semibold text-gray-300">Total Products</h2>
      <p className="text-4xl font-bold text-yellow-400">{productCount}</p>
    </div>

    {/* Expired Users */}
    <div className="bg-white/10 backdrop-blur-lg shadow-lg rounded-lg p-6 border border-white/20">
      <h2 className="text-lg font-semibold text-gray-300">Expired Users</h2>
      <p className="text-4xl font-bold text-red-400">{expiredUserCount}</p>
    </div>
  </div>

  {/* Charts Section */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Doughnut Chart */}
    <div className="bg-white/10 backdrop-blur-lg shadow-lg rounded-lg p-6 border border-white/20">
      <h2 className="text-lg font-semibold text-gray-300 mb-4">
        User, Product, and Expired User Distribution
      </h2>
      <Doughnut data={doughnutData} />
    </div>

    {/* Bar Chart */}
    <div className="bg-white/10 backdrop-blur-lg shadow-lg rounded-lg p-6 border border-white/20">
      <h2 className="text-lg font-semibold text-gray-300 mb-4">
        Overview of Users, Products, and Expired Users
      </h2>
      <Bar data={barData} />
    </div>
  </div>
</div>

  );
};

export default AdminHome;
