const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Nodemailer transporter configuration (use environment variables for credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable for security
    pass: process.env.EMAIL_PASSWORD // Use environment variable for security
  }
});

// Helper function for creating responses
function createResponse(ok, message, data = null) {
  return { ok, message, data };
}

// Registration Route
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      weightInKg,
      heightInCm,
      gender,
      dob,
      goal,
      activityLevel
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json(createResponse(false, "Email already exists."));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      weight: [{ weight: weightInKg, date: Date.now() }],
      height: [{ height: heightInCm, date: Date.now() }],
      gender,
      dob,
      goal,
      activityLevel
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json(createResponse(true, "User registered successfully."));
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json(createResponse(false, "Registration failed."));
  }
});

// Login Route
// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      console.log("Missing email or password.");
      return res
        .status(400)
        .json({ ok: false, message: "Email and password are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Email not found in the database:", email); // Add logging for debugging
      return res
        .status(400)
        .json({ ok: false, message: "Invalid email or password." });
    }

    console.log("User found:", user); // Log user info to ensure the user was found

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password provided:", password); // Log the plain password
    console.log("Hashed password in DB:", user.password); // Log the hashed password from DB
    console.log("Password match result:", isMatch); // Log the result of the bcrypt.compare()

    if (!isMatch) {
      console.log("Password mismatch for user:", email); // Log password mismatch
      return res
        .status(400)
        .json({ ok: false, message: "Invalid email or password." });
    }

    // If password matches, generate JWT tokens
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Set cookies securely
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure flag in production
      sameSite: "Strict"
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    console.log("User logged in successfully:", email); // Log successful login
    res
      .status(200)
      .json(
        createResponse(true, "Login successful", { authToken, refreshToken })
      );
  } catch (err) {
    console.error("Error during login:", err); // Log any unexpected errors
    res.status(500).json(createResponse(false, "Login failed."));
  }
});

// Token Refresh Route
router.post("/refreshAuthToken", (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json(createResponse(false, "No refresh token provided"));
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json(createResponse(false, "Invalid refresh token"));
      }

      // Generate new authToken
      const newAuthToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "15m"
        }
      );

      // Set new authToken as a cookie
      res.cookie("authToken", newAuthToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "Strict"
      });

      res
        .status(200)
        .json(
          createResponse(true, "Token refreshed", { authToken: newAuthToken })
        );
    }
  );
});

// OTP Route (for future use)
router.post("/sendOtp", async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for verification",
      text: `Your OTP is ${otp}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return next(err);
      }
      res.json(createResponse(true, "OTP sent successfully", { otp }));
    });
  } catch (err) {
    next(err);
  }
});

// Error handler middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(createResponse(false, "Internal server error"));
});

module.exports = router;
