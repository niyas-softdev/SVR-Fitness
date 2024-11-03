import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdSystemUpdateAlt, MdDelete, MdAutorenew } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa"; // WhatsApp icon import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API || "http://localhost:5174"
});

function UserController() {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // States for editing user
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [plan, setPlan] = useState("");
  const [planDate, setPlanDate] = useState("");
  const [planStatus, setPlanStatus] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [userId, setUserId] = useState(""); // Added to handle userId in edit mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [currentUserPhone, setCurrentUserPhone] = useState("");
  const plans = [
    "1 Month Plan",
    "3 Months Plan",
    "6 Months Plan",
    "Annual Plan"
  ];

  const getToken = () => sessionStorage.getItem("userToken") || "";

  useEffect(() => {
    fetchUsers();
    fetchUserCount();
  }, []);

  const fetchUsers = async (searchQuery = "") => {
    try {
      let response;
      if (searchQuery) {
        response = await axiosInstance.get("/api/user/search", {
          headers: { Authorization: `Bearer ${getToken()}` },
          params: { name: searchQuery, userId: searchQuery }
        });
      } else {
        response = await axiosInstance.get("/api/user/get", {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      setUsers(response.data.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("No users found.");
      } else {
        toast.error("Failed to fetch users.");
      }
      setUsers([]);
    }
  };

  const fetchUserCount = async () => {
    try {
      const response = await axiosInstance.get("/api/user/userCount", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setUserCount(response.data.count);
    } catch (error) {
      toast.error("Failed to fetch user count.");
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchUsers(searchQuery);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/user/delete/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success("User deleted successfully.");
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber);
    setRole(user.role);
    setPlanStatus(user.planStatus);
    setPlanDate(formatDate(user.planDate));
    setPlan(user.plan);
    setExpiryDate(formatDate(user.expiryDate));
    setUserId(user.userId); // Set userId when editing
  };

  const handleResetUserId = async () => {
    try {
      // Reset userId on the backend for the editing user
      const response = await axiosInstance.put(
        `/api/user/resetUserId/${editingUser._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` }
        }
      );
      toast.success("User ID reset successfully.");
      setUserId(response.data.data.userId); // Update the new userId in the form
    } catch (error) {
      toast.error("Failed to reset User ID.");
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const userData = {
        name,
        email,
        phoneNumber,
        role,
        plan,
        planDate,
        planStatus
      };
      await axiosInstance.put(`/api/user/update/${editingUser._id}`, userData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success("User updated successfully.");
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPhoneNumber("");
    setRole("");
    setPlan("");
    setPlanDate("");
    setExpiryDate("");
    setPlanStatus(false);
    setUserId(""); // Reset userId field
  };

  const handleWhatsAppClick = (phone) => {
    setCurrentUserPhone(phone);
    setMessage(""); // Clear previous message
    setIsModalOpen(true); // Open the modal
  };

  const sendMessage = () => {
    const url = `https://wa.me/${currentUserPhone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
    setIsModalOpen(false); // Close the modal after sending
  };

  return (
    <div className="container mx-auto min-h-screen py-5 px-4 bg-black text-white">
      {!editingUser && (
        <>
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-extrabold">
              User Management ({userCount})
            </h1>
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or User ID"
                className="bg-white/10 p-2 rounded-lg border-none text-white"
              />
              <button
                type="submit"
                className="ml-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 shadow-md transition-all"
              >
                Search
              </button>
            </form>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white bg-opacity-10 backdrop-blur-lg text-white shadow-lg rounded-lg">
              <thead>
                <tr className="bg-white bg-opacity-20">
                  <th className="py-4 px-6 border-b border-white text-left">
                    User ID
                  </th>
                  <th className="py-4 px-6 border-b border-white text-left">
                    Name
                  </th>
                  <th className="py-4 px-6 border-b border-white text-left">
                    Plan
                  </th>
                  <th className="py-4 px-6 border-b border-white text-left">
                    Joined Date
                  </th>
                  <th className="py-4 px-6 border-b border-white text-left">
                    Expiry Date
                  </th>
                  <th className="py-4 px-6 border-b border-white text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-white hover:bg-opacity-20 transition"
                    >
                      <td className="py-4 px-6 border-b border-white">
                        {user.userId}
                      </td>
                      <td className="py-4 px-6 border-b border-white">
                        {user.name}
                      </td>
                      <td className="py-4 px-6 border-b border-white">
                        {user.plan}
                      </td>
                      <td className="py-4 px-6 border-b border-white">
                        {new Date(user.planDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 border-b border-white">
                        {new Date(user.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 border-b border-white flex gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="bg-yellow-500/50 py-2 px-4 rounded-lg hover:bg-yellow-600/50 transition-all flex items-center"
                        >
                          <MdSystemUpdateAlt className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500/50 py-2 px-4 rounded-lg hover:bg-red-600/50 transition-all flex items-center"
                        >
                          <MdDelete className="mr-2" /> Delete
                        </button>
                        <button
                          onClick={() => handleWhatsAppClick(user.phoneNumber)}
                          className="bg-green-500/50 py-2 px-4 rounded-lg hover:bg-green-600/50 transition-all flex items-center"
                        >
                          <FaWhatsapp />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center py-4 px-6" colSpan="6">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

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

      {/* Edit User Form */}
      {editingUser && (
        <div className="flex justify-center items-center">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-6 text-center">Edit User</h3>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm mb-1">User ID</label>
                  <input
                    type="text"
                    value={userId}
                    readOnly
                    className="w-full bg-gray-700 text-gray-300 p-2 rounded-lg border-none"
                  />
                  <button
                    type="button"
                    onClick={handleResetUserId}
                    className="mt-2 bg-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
                  >
                    <MdAutorenew className="mr-2" /> Reset ID
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/10 p-2 rounded-lg border-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 p-2 rounded-lg border-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white/10 p-2 rounded-lg border-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white/10 p-2 rounded-lg border-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Plan</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full bg-white/10 p-2 rounded-lg border-none"
                    required
                  >
                    <option value="" disabled>
                      Select Plan
                    </option>
                    {plans.map((p) => (
                      <option key={p} value={p} className="text-gray-800">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Plan Date</label>
                  <input
                    type="date"
                    value={planDate}
                    onChange={(e) => setPlanDate(e.target.value)}
                    className="w-full bg-white/10 p-2 rounded-lg border-none"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  readOnly
                  className="w-full bg-white/10 p-2 rounded-lg border-none"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={planStatus}
                    onChange={(e) => setPlanStatus(e.target.checked)}
                    className="mr-2"
                  />
                  Active Plan Status
                </label>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-green-500/50 py-2 px-4 rounded-lg hover:bg-green-600/50 transition-all"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-red-500/50 py-2 px-4 rounded-lg hover:bg-red-600/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default UserController;
