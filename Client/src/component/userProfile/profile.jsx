import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    address: "",
    image: "",
    role: "user",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planInfo, setPlanInfo] = useState(null);

  const hasFetched = useRef(false); // 🚫 Prevent double-fetching
  const userId = useRef(localStorage.getItem("userId")).current;

  useEffect(() => {
    if (hasFetched.current || !userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5174/api/profile/get/${userId}`, {
          headers: { userid: userId },
        });
        if (res.data.success) {
          setUserProfile(res.data.data);
        }
      } catch (err) {
        console.error("Profile error:", err);
      }
    };

    const fetchPlan = async () => {
      try {
        const res = await axios.get(`http://localhost:5174/api/membership/getUserPlanDetails/${userId}`);
        if (res.data.success) {
          setPlanInfo(res.data);
        }
      } catch (err) {
        console.error("Membership plan error:", err);
      }
    };

    fetchProfile();
    fetchPlan();

    hasFetched.current = true;
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
<div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
  <div className="bg-gray-900 rounded-3xl shadow-2xl p-6 sm:p-10 border border-gray-700 space-y-8">
    
    {/* Header */}
    <div className="flex flex-col items-center text-center">
      <img
        className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
        src={userProfile.image || "https://via.placeholder.com/150"}
        alt="Profile"
      />
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-4">{userProfile.name}</h2>
      <p className="text-gray-400 text-sm">{userProfile.email}</p>
      <span className="mt-2 inline-block px-4 py-1 rounded-full text-xs font-medium bg-indigo-700 text-white uppercase">
        Role: {userProfile.role}
      </span>
    </div>

    {/* Admin Message */}
    {userProfile.role === "admin" && (
      <div className="text-center text-green-400 text-base font-medium">
        Admin Access: You can manage users, plans, and dashboard.
      </div>
    )}

    {/* Edit Mode */}
    {isEditing ? (
      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Profile Picture URL</label>
          <input
            type="text"
            name="image"
            value={userProfile.image}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={userProfile.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={userProfile.phoneNumber}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Gender</label>
          <select
            name="gender"
            value={userProfile.gender}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={userProfile.dob}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-300 mb-1">Address</label>
          <textarea
            name="address"
            value={userProfile.address}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
            rows="2"
          ></textarea>
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="w-full sm:w-auto bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
        {/* Basic Info */}
        <div className="space-y-2">
          <p><span className="font-semibold">Phone:</span> {userProfile.phoneNumber || "N/A"}</p>
          <p><span className="font-semibold">Gender:</span> {userProfile.gender || "N/A"}</p>
          <p><span className="font-semibold">DOB:</span> {userProfile.dob ? new Date(userProfile.dob).toLocaleDateString() : "N/A"}</p>
          <p><span className="font-semibold">Address:</span> {userProfile.address || "N/A"}</p>
        </div>

        {/* Plan Info */}
        {userProfile.role !== "admin" && planInfo && (
          <div className="space-y-2">
            <p><span className="font-semibold">Plan Name:</span> {planInfo?.data?.plan?.name || "N/A"}</p>
            <p><span className="font-semibold">Duration:</span> {planInfo?.data?.plan?.duration || "N/A"}</p>
            <p><span className="font-semibold">Purchase Date:</span> {planInfo?.data?.status?.purchaseDate ? new Date(planInfo.data.status.purchaseDate).toLocaleDateString() : "N/A"}</p>
            <p><span className="font-semibold">Expiry Date:</span> {planInfo?.data?.status?.expiryDate ? new Date(planInfo.data.status.expiryDate).toLocaleDateString() : "N/A"}</p>
            <p><span className="font-semibold">Days Left:</span> {planInfo?.data?.status?.daysToExpire ?? "N/A"} day(s)</p>
            <p>
              <span className="font-semibold">Plan Status:</span>{" "}
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                planInfo?.data?.status?.planStatus === "Active"
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}>
                {planInfo?.data?.status?.planStatus || "Inactive"}
              </span>
            </p>
          </div>
        )}

        {/* Edit Button */}
        <div className="md:col-span-2">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700 transition"
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
