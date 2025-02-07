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
    // Get the userId from headers or body (ensure flexibility)
    const userId = req.headers.userid || req.body.userId || req.body._id;

    // Validate if userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Extract fields from the request body
    const { name, phoneNumber, address, image, gender, dob } = req.body;

    // Check if at least one field is being updated
    if (!name && !phoneNumber && !address && !image && !gender && !dob) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update the profile.",
      });
    }

    // Prepare the update object dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;
    if (image) updateData.image = image;
    if (gender) updateData.gender = gender;
    if (dob) updateData.dob = dob;

    // Update the user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true } // Return the updated document
    ).select("-password"); // Exclude the password field from the response

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user details",
      error: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
