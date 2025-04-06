import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    plan: "",
    planDate: "",
    expiryDate: "",
    planStatus: false,
    address: "",
    image: "",
    role: "user",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5174/api/profile/get/${userId}`, {
          headers: { userid: userId },
        })
        .then((response) => {
          if (response.data.success) {
            setUserProfile(response.data.data);
          }
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedProfile = { ...userProfile, userId };

    try {
      const response = await axios.put(
        `http://localhost:5174/api/profile/update/${userId}`,
        updatedProfile
      );
      if (response.data.success) {
        setUserProfile(response.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <img
            className="h-28 w-28 rounded-full object-cover border-4 border-indigo-500 shadow-md"
            src={userProfile.image || "https://via.placeholder.com/150"}
            alt="Profile"
          />
          <h2 className="text-3xl font-bold text-white mt-4">{userProfile.name}</h2>
          <p className="text-gray-400">{userProfile.email}</p>
          <p className="mt-2 text-sm font-semibold px-4 py-1 rounded-full bg-indigo-700 text-white">
            Role: {userProfile.role.toUpperCase()}
          </p>
        </div>

        {userProfile.role === "admin" && (
          <div className="mb-6 text-center text-green-400 text-lg font-medium">
            Admin Access: You can manage users, plans, and dashboard.
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300">Profile Picture URL</label>
              <input
                type="text"
                name="image"
                value={userProfile.image}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                value={userProfile.name}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={userProfile.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-gray-300">Gender</label>
              <select
                name="gender"
                value={userProfile.gender}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={userProfile.dob}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-300">Address</label>
              <textarea
                name="address"
                value={userProfile.address}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                rows="2"
              ></textarea>
            </div>

            <div className="col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
            <div>
              <p><span className="font-medium">Phone:</span> {userProfile.phoneNumber || "N/A"}</p>
              <p><span className="font-medium">Gender:</span> {userProfile.gender || "N/A"}</p>
              <p><span className="font-medium">DOB:</span> {userProfile.dob ? new Date(userProfile.dob).toLocaleDateString() : "N/A"}</p>
              <p><span className="font-medium">Address:</span> {userProfile.address || "N/A"}</p>
            </div>
            {userProfile.role !== "admin" && (
              <div>
                <p><span className="font-medium">Plan:</span> {userProfile.plan || "N/A"}</p>
                <p><span className="font-medium">Plan Start:</span> {userProfile.planDate ? new Date(userProfile.planDate).toLocaleDateString() : "N/A"}</p>
                <p><span className="font-medium">Expiry Date:</span> {userProfile.expiryDate ? new Date(userProfile.expiryDate).toLocaleDateString() : "N/A"}</p>
                <p>
                  <span className="font-medium">Plan Status:</span>{" "}
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    userProfile.planStatus ? "bg-green-600 text-white" : "bg-red-600 text-white"
                  }`}>
                    {userProfile.planStatus ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            )}
            <div className="col-span-2">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-indigo-600 text-white py-2 mt-6 rounded hover:bg-indigo-700 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
