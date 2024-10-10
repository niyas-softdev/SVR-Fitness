const User = require("../models/userModel"); // Assuming you have a user model defined
const bcrypt = require("bcrypt");

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

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      ...req.body,
      password: hashedPassword // Store hashed password
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User added successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message
    });
  }
};

// UPDATE a user by ID
const updateUser = async (req, res) => {
  try {
    // Hash the password if it's being updated
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensures validation rules in the schema are applied
      select: "-password" // Do not return the password in the response
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

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
  deleteUser
};
