import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWhatsapp } from "react-icons/fa";

const ExpireUser = () => {
  const [aboutToExpireUsers, setAboutToExpireUsers] = useState([]);
  const [expiredUsers, setExpiredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserPhone, setCurrentUserPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchExpiringAndExpiredUsers();
  }, []);

  const fetchExpiringAndExpiredUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5174/api/user/expiredUsers`
      );
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

  const handleWhatsAppClick = (phone, isExpired) => {
    setCurrentUserPhone(phone);
    setMessage(
      isExpired
        ? "Your plan is expired. Please renew it."
        : "Your plan is expiring soon. Please renew it."
    );
    setIsModalOpen(true);
  };

  const sendMessage = () => {
    const url = `https://wa.me/${currentUserPhone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto py-5 px-4">
      <h1 className="text-3xl font-extrabold mb-6 text-white text-center sm:text-left">
        Users with Expired or Expiring Plans
      </h1>
      <ToastContainer />

      {/* Plans Expiring Soon */}
      {aboutToExpireUsers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl text-yellow-400 font-bold mb-4 text-center sm:text-left">
            Plans Expiring Soon (Within 10 Days)
          </h2>
          <div className="flex flex-wrap gap-4">
            {aboutToExpireUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white bg-opacity-10 backdrop-blur-md text-white shadow-lg rounded-lg p-4 w-full sm:w-1/2 lg:w-1/3"
              >
                <p className="font-semibold">Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Plan: {user.plan}</p>
                <p className="text-yellow-400 font-semibold">
                  Expiring Date: {formatDate(user.expiryDate)}
                </p>
                <button
                  onClick={() => handleWhatsAppClick(user.phoneNumber, false)}
                  className="mt-4 bg-green-500/50 py-2 px-4 rounded-lg hover:bg-green-600/50 transition-all flex items-center"
                >
                  <FaWhatsapp className="mr-2" /> WhatsApp
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expired Plans */}
      {expiredUsers.length > 0 && (
        <div>
          <h2 className="text-2xl text-red-400 font-bold mb-4 text-center sm:text-left">
            Expired Plans
          </h2>
          <div className="flex flex-wrap gap-4">
            {expiredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white bg-opacity-10 backdrop-blur-md text-white shadow-lg rounded-lg p-4 w-full sm:w-1/2 lg:w-1/3"
              >
                <p className="font-semibold">Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Plan: {user.plan}</p>
                <p className="text-red-400 font-semibold">
                  Expired Date: {formatDate(user.expiryDate)}
                </p>
                <button
                  onClick={() => handleWhatsAppClick(user.phoneNumber, true)}
                  className="mt-4 bg-green-500/50 py-2 px-4 rounded-lg hover:bg-green-600/50 transition-all flex items-center"
                >
                  <FaWhatsapp className="mr-2" /> WhatsApp
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Message Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
              Send WhatsApp Message
            </h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows="4"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 mb-4 text-black"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition"
              >
                Send
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpireUser;
