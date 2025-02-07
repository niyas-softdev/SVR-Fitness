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
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  // Fetch user profile data
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5174/api/profile/get/${userId}`, {
          headers: { userid: userId },
        })
        .then((response) => {
          if (response.data.success) {
            setUserProfile(response.data.data); // Set the full data
          } else {
            console.error("Failed to fetch user data");
          }
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    }
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Include userId in the body of the request
    const updatedProfile = { ...userProfile, userId };

    try {
      const response = await axios.put(
        `http://localhost:5174/api/profile/update/${userId}`,
        updatedProfile
      );
      if (response.data.success) {
        setUserProfile(response.data.data);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg border border-gray-700">
      <div className="text-center mb-6">
        <img
          className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover"
          src={userProfile.image || "https://via.placeholder.com/150"}
          alt="Profile"
        />
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-200">
          {userProfile.name}
        </h2>
        <p className="text-gray-400">{userProfile.email}</p>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-300">Profile Picture URL</label>
            <input
              type="text"
              name="image"
              value={userProfile.image}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={userProfile.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
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
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-300">Gender</label>
            <select
              name="gender"
              value={userProfile.gender}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
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
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-300">Address</label>
            <textarea
              name="address"
              value={userProfile.address}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-300">Plan</label>
            <input
              type="text"
              name="plan"
              value={userProfile.plan}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              disabled
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-gray-300">
          <p>
            <strong>Phone:</strong> {userProfile.phoneNumber || "N/A"}
          </p>
          <p>
            <strong>Gender:</strong> {userProfile.gender || "N/A"}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {userProfile.dob
              ? new Date(userProfile.dob).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {userProfile.address || "N/A"}
          </p>
          <p>
            <strong>Plan:</strong> {userProfile.plan || "N/A"}
          </p>
          <p>
            <strong>Plan Start Date:</strong>{" "}
            {userProfile.planDate
              ? new Date(userProfile.planDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Plan Expiry Date:</strong>{" "}
            {userProfile.expiryDate
              ? new Date(userProfile.expiryDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Plan Status:</strong>{" "}
            {userProfile.planStatus ? "Active" : "Inactive"}
          </p>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
