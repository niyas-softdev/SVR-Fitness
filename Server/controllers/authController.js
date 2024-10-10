const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// Helper function for creating a response
function createResponse(ok, message, data = null) {
  return { ok, message, data };
}

// Signup controller
const signUp = async (req, res) => {
  try {
    const { name, email, password, weightInKg, heightInCm, gender, dob, goal, activityLevel } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json(createResponse(false, "User already exists"));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      weight: [{ weight: weightInKg,  date: Date.now() }],
      height: [{ height: heightInCm,  date: Date.now() }],
      gender,
      dob,
      goal,
      activityLevel,
    });

    await newUser.save();
    return res.status(201).json(createResponse(true, "Successfully signed up"));
  } catch (error) {
    return res.status(500).json(createResponse(false, error.message));
  }
};

// Login controller
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json(createResponse(false, "Invalid Email"));
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(createResponse(false, "Invalid credentials"));
    }

    // Generate JWT auth and refresh tokens
    const authToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    // Set tokens in cookies
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: true, // Set true in production
      sameSite: "Strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    // Return the response
    return res.status(200).json(createResponse(true, "Login successful", { authToken, refreshToken }));
  } catch (error) {
    return res.status(500).json(createResponse(false, error.message));
  }
};

// Token refresh controller
const refreshAuthToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json(createResponse(false, "No refresh token provided"));
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json(createResponse(false, "Invalid refresh token"));
    }

    // Generate new auth token
    const newAuthToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: "15m" });

    // Set new auth token as a cookie
    res.cookie("authToken", newAuthToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json(createResponse(true, "Token refreshed", { authToken: newAuthToken }));
  });
};

// OTP sending controller
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "OTP for verification",
      text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json(createResponse(false, "Failed to send OTP"));
      }
      return res.json(createResponse(true, "OTP sent successfully", { otp }));
    });
  } catch (err) {
    return res.status(500).json(createResponse(false, err.message));
  }
};

module.exports = {
  signUp,
  signIn,
  refreshAuthToken,
  sendOtp,
};
