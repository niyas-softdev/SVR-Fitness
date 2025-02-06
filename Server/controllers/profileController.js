const User = require("../models/userModel");

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.headers.userid;
    console.log(req.headers);
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user details", error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.headers.userid;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const { name, phone, address, image } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phoneNumber: phone, address, image },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user details", error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
