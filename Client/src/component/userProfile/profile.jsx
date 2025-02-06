import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    image: "",
    phoneNumber: "",
    address: "",
    dob: "",
    gender: "",
    plan: "",
    planDate: "",
    expiryDate: "",
  });

  const userId = localStorage.getItem("userId"); // Fetch user ID from local storage

  // Fetch user profile data
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5174/api/profile/get/${userId}`, {
          headers: { userid: userId },
        })
        .then((response) => {
          if (response.data.success) {
            setUserProfile(response.data.data);
          } else {
            console.error("Failed to fetch user data");
          }
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    }
  }, [userId]);

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
      <div className="text-center mb-8">
        <img
          className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover"
          src={userProfile.image || "https://via.placeholder.com/150"}
          alt="Profile"
        />
        <h2 className="text-3xl font-semibold text-gray-200">{userProfile.name}</h2>
        <p className="text-gray-400">{userProfile.email}</p>
      </div>
      <div className="space-y-4">
        <p>
          <strong>Phone:</strong> {userProfile.phoneNumber || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {userProfile.address || "N/A"}
        </p>
        <p>
          <strong>Date of Birth:</strong> {userProfile.dob || "N/A"}
        </p>
        <p>
          <strong>Gender:</strong> {userProfile.gender || "N/A"}
        </p>
        <p>
          <strong>Plan:</strong> {userProfile.plan || "N/A"}
        </p>
        <p>
          <strong>Plan Start Date:</strong> {userProfile.planDate || "N/A"}
        </p>
        <p>
          <strong>Plan Expiry Date:</strong> {userProfile.expiryDate || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
