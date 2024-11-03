import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpireUser = () => {
  const [aboutToExpireUsers, setAboutToExpireUsers] = useState([]);
  const [expiredUsers, setExpiredUsers] = useState([]);

  useEffect(() => {
    fetchExpiringAndExpiredUsers();
  }, []);

  const fetchExpiringAndExpiredUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5174/api/user/expiredUsers`
      ); // Adjust the API path if necessary
      setAboutToExpireUsers(response.data.data.aboutToExpire);
      setExpiredUsers(response.data.data.expired);
      toast.success("Users retrieved successfully.");
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container mx-auto py-5 px-4 ">
      <h1 className="text-3xl font-extrabold  mb-6 text-white">Users with Expired or Expiring Plans</h1>
      <ToastContainer />

      {aboutToExpireUsers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl text-yellow-400 font-bold mb-4">Plans Expiring Soon (Within 10 Days)</h2>
          <table className="min-w-full bg-white bg-opacity-10 backdrop-blur-md text-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-white bg-opacity-20">
                <th className="py-4 px-6 border-b border-white">Name</th>
                <th className="py-4 px-6 border-b border-white">Email</th>
                <th className="py-4 px-6 border-b border-white">Plan</th>
                <th className="py-4 px-6 border-b border-white">Expiring Date</th>
              </tr>
            </thead>
            <tbody>
              {aboutToExpireUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white hover:bg-opacity-20 transition">
                  <td className="py-4 px-6 border-b border-white">{user.name}</td>
                  <td className="py-4 px-6 border-b border-white">{user.email}</td>
                  <td className="py-4 px-6 border-b border-white">{user.plan}</td>
                  <td className="py-4 px-6 border-b border-white text-yellow-400 font-semibold">
                    {formatDate(user.expiryDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {expiredUsers.length > 0 && (
        <div>
          <h2 className="text-2xl  text-red-400 font-bold mb-4">Expired Plans</h2>
          <table className="min-w-full bg-white bg-opacity-10 backdrop-blur-md text-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-white bg-opacity-20">
                <th className="py-4 px-6 border-b border-white">Name</th>
                <th className="py-4 px-6 border-b border-white">Email</th>
                <th className="py-4 px-6 border-b border-white">Plan</th>
                <th className="py-4 px-6 border-b border-white">Expired Date</th>
              </tr>
            </thead>
            <tbody>
              {expiredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white hover:bg-opacity-20 transition">
                  <td className="py-4 px-6 border-b border-white">{user.name}</td>
                  <td className="py-4 px-6 border-b border-white">{user.email}</td>
                  <td className="py-4 px-6 border-b border-white">{user.plan}</td>
                  <td className="py-4 px-6 border-b border-white text-red-400 font-semibold">
                    {formatDate(user.expiryDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aboutToExpireUsers.length === 0 && expiredUsers.length === 0 && (
        <p className="text-white text-center mt-8">No expiring or expired plans found.</p>
      )}
    </div>
  );
};

export default ExpireUser;
