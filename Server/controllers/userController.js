const User = require("../models/userModel"); // Assuming you have a user model defined
const generateUserId = require("../controllers/generateUserId");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password from the returned users
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { name, userId } = req.query;

    // If neither name nor userId is provided, return an error
    if (!name && !userId) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let usersByName = [];
    let usersByUserId = [];

    // Perform a case-insensitive search for name if provided
    if (name) {
      usersByName = await User.find({ name: new RegExp(name, "i") });
    }

    // Perform an exact match search for userId if provided
    if (userId) {
      usersByUserId = await User.find({ userId: userId });
    }

    // Combine results: Remove duplicates if the same user is found in both searches
    const combinedUsers = [...new Map([...usersByName, ...usersByUserId].map((user) => [user._id.toString(), user])).values()];

    // Check if any users were found
    if (combinedUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the combined result
    return res.status(200).json({ data: combinedUsers });
  } catch (error) {
    console.error("Error in searchUsers function:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};


const getExpiredUserCount = async (req, res) => {
  try {
    const expiredUserCount = await User.countDocuments({
      planStatus: true, // Plan is considered active before expiry
      expiryDate: { $lt: new Date() } // Plan has expired if expiryDate is before today's date
    });

    res.status(200).json({ expiredCount: expiredUserCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const expiredUsers = async (req, res) => {
  try {
    const today = new Date();
    const warningDate = new Date();
    warningDate.setDate(today.getDate() + 10); // Date 10 days from today

    // Run both queries concurrently for better performance using Promise.all
    const [aboutToExpireUsers, expiredUsers] = await Promise.all([
      User.find({
        expiryDate: { $gte: today, $lte: warningDate },
        planStatus: true // Active plans that are about to expire
      }),
      User.find({
        expiryDate: { $lt: today },
        planStatus: true // Active plans that have already expired
      })
    ]);

    if (aboutToExpireUsers.length === 0 && expiredUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users with expiring or expired plans found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Users with expiring or expired plans retrieved successfully",
      data: {
        aboutToExpire: aboutToExpireUsers,
        expired: expiredUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users with expiring or expired plans",
      error: error.message
    });
  }
};

// Generate a new user ID in the format SVR-01, SVR-02, etc.

const userCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments(); // Count the total number of users

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      count: userCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};

const resetUserId = async (req, res) => {
  try {
    const newUserId = await generateUserId(); // Generate a new User ID
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { userId: newUserId },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "User ID reset successfully",
        data: updatedUser
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error resetting User ID",
        error: error.message
      });
  }
};

// CREATE a new user
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Generate a new User ID
    const newUserId = await generateUserId();

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with the generated User ID
    const newUser = new User({
      ...req.body,
      userId: newUserId, // Set the generated userId
      password: hashedPassword // Store hashed password
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User added successfully",
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message
    });
  }
};

const calculateExpiryDate = (planDate, plan) => {
  const date = new Date(planDate); // Create a new date object to avoid mutating the original

  // Calculate expiry date based on plan type
  switch (plan) {
    case "1 Month Plan":
      date.setMonth(date.getMonth() + 1); // Add 1 month
      break;
    case "3 Months Plan":
      date.setMonth(date.getMonth() + 3); // Add 3 months
      break;
    case "6 Months Plan":
      date.setMonth(date.getMonth() + 6); // Add 6 months
      break;
    case "Annual Plan":
      date.setFullYear(date.getFullYear() + 1); // Add 1 year
      break;
    default:
      return null; // Invalid plan type
  }

  return date; // Return the correctly calculated expiry date
};

// UPDATE a user by ID
const updateUser = async (req, res) => {
  try {
    // Get the token from the authorization header
    const token = req.headers.authorization.split(" ")[1]; // Assuming "Bearer <token>"
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. No token provided."
      });
    }

    // Decode the token to get the user ID and role
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id; // Assuming your token stores the user ID as `id`
    const userRole = decoded.role; // Assuming your token stores the user role as `role`

    // Only allow users to update their own data or if they are an admin
    if (req.params.id !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to update this user." });
    }

    // Calculate expiry date based on the plan and planDate
    const expiryDate = calculateExpiryDate(req.body.planDate, req.body.plan);
    if (!expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type provided."
      });
    }

    // Find the user by ID and update the necessary fields while preserving the userId
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        phoneNumber: req.body.phoneNumber,
        plan: req.body.plan,
        planDate: req.body.planDate,
        planStatus: req.body.planStatus,
        expiryDate: expiryDate,
        userId: existingUser.userId // Ensure userId is not changed
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
        select: "-password" // Do not return the password
      }
    );

    // Send success response
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message
    });
  }
};

// DELETE a user by ID
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  userCount,
  expiredUsers,
  searchUsers,
  getExpiredUserCount,
  resetUserId
};
