const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const transporter = require("../config/nodeMailer"); // Use centralized Nodemailer config
const axios = require("axios");

// Helper function for creating a response
function createResponse(ok, message, data = null) {
  return { ok, message, data };
}

// Signup Controller
const signUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      weightInKg,
      heightInCm,
      gender,
      dob,
      goal,
      activityLevel
    } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json(createResponse(false, "User already exists"));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with default role 'user'
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role assigned
      phoneNumber,
      weight: [{ weight: weightInKg, date: Date.now() }],
      height: [{ height: heightInCm, date: Date.now() }],
      gender,
      dob,
      goal,
      activityLevel
    });

    await newUser.save();
    return res.status(201).json(createResponse(true, "Successfully signed up"));
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json(createResponse(false, "Signup failed"));
  }
};

// Login Controller
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(createResponse(false, "Invalid email or password"));
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json(createResponse(false, "Invalid email or password"));
    }

    // Send login response with user role
    return res.status(200).json(
      createResponse(true, "Login successful", {
        authToken,
        refreshToken,
        userId: user._id,
        role: user.role
      })
    );
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json(createResponse(false, "Login failed"));
  }
};

const googleLogin = async (req, res) => {
  try {
    // 1. Fetch user information from Google API
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${req.body.token}` } }
    );

    const { name, email, picture } = userInfo.data;

    // 2. Check if user already exists
    let user = await UserModel.findOne({ email });

    if (!user) {
      // 3. If not, create a new user
      user = new UserModel({
        name,
        email,
        image: picture
      });
      await user.save();
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role
      },
      process.env.JWT_SECRET_KEY, // Ensure the secret is set in your environment
      { expiresIn: "1d" } // Token expiration times
    );

    // 5. Send response with token and user data
    return res.status(200).json({
      message: "Successfully logged in",
      token
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  signUp,
  signIn,
  googleLogin
};
