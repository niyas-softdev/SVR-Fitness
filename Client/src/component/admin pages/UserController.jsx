import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API || "http://localhost:5174"
});

function UserController() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [step, setStep] = useState(1);

  const getToken = () => sessionStorage.getItem("userToken") || "";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/user/get", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  const handleDetailsClick = (user, edit = false) => {
    setSelectedUser(user);
    setIsEditMode(edit);
    setIsPopupOpen(true);
    setStep(1);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
    setIsEditMode(false);
    setStep(1);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/user/delete/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success("User deleted successfully.");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const handleWhatsapp = (user) => {
    const url = `https://wa.me/${user.phoneNumber}?text=Hello%20${user.name}`;
    window.open(url, '_blank');
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (step < 2) {
      handleNext();
      return;
    }
    try {
      const updatedUser = { ...selectedUser };
      await axiosInstance.put(`/api/user/update/${selectedUser._id}`, updatedUser, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success("User updated successfully.");
      closePopup();
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">User Controller</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-zinc-800 p-5 rounded-xl shadow-lg flex flex-col justify-between"
          >
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-gray-400">ID: {user.userId}</p>
            </div>
            <div className="flex justify-between items-center mt-4 gap-2">
              <button
                onClick={() => handleDetailsClick(user)}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-sm text-white rounded-lg"
              >
                Details
              </button>
              <button
                onClick={() => handleWhatsapp(user)}
                className="flex items-center justify-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                <FaWhatsapp />
              </button>
              <button
                onClick={() => handleDetailsClick(user, true)}
                className="flex items-center justify-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
              >
                <MdEdit />
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isPopupOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-zinc-800 text-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-white text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? `Edit User (Step ${step})` : "User Details"}
            </h2>
            {isEditMode ? (
              <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                {step === 1 && (
                  <>
                    <input
                      type="text"
                      value={selectedUser.name}
                      onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                      placeholder="Name"
                      className="p-2 bg-zinc-700 text-white border border-zinc-600 rounded"
                    />
                    <input
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      placeholder="Email"
                      className="p-2 bg-zinc-700 text-white border border-zinc-600 rounded"
                    />
                    <input
                      type="text"
                      value={selectedUser.phoneNumber}
                      onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
                      placeholder="Phone Number"
                      className="p-2 bg-zinc-700 text-white border border-zinc-600 rounded"
                    />
                  </>
                )}
                {step === 2 && (
                  <>
                    <input
                      type="text"
                      value={selectedUser.role}
                      onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                      placeholder="Role"
                      className="p-2 bg-zinc-700 text-white border border-zinc-600 rounded"
                    />
                    <input
                      type="text"
                      value={selectedUser.plan}
                      onChange={(e) => setSelectedUser({ ...selectedUser, plan: e.target.value })}
                      placeholder="Plan"
                      className="p-2 bg-zinc-700 text-white border border-zinc-600 rounded"
                    />
                    <input
                      type="date"
                      value={selectedUser.planDate?.split("T")[0] || ""}
                      onChange={(e) => setSelectedUser({ ...selectedUser, planDate: e.target.value })}
                      className="p-2 bg-zinc-700 text-white border border-zinc-600 rounded"
                    />
                    <label className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={selectedUser.planStatus}
                        onChange={(e) => setSelectedUser({ ...selectedUser, planStatus: e.target.checked })}
                      />
                      Active Plan
                    </label>
                  </>
                )}
                <div className="flex justify-between mt-4">
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="bg-gray-500 text-white px-4 py-2 rounded">
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {step < 2 ? "Next" : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>User ID:</strong> {selectedUser.userId}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Plan:</strong> {selectedUser.plan}</p>
                <p><strong>Plan Date:</strong> {new Date(selectedUser.planDate).toLocaleDateString()}</p>
                <p><strong>Expiry Date:</strong> {new Date(selectedUser.expiryDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {selectedUser.planStatus ? "Active" : "Inactive"}</p>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={closePopup}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default UserController;