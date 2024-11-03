const express = require('express');
const router = express.Router();
const Admin = require('../models/adminModel'); // Import the Admin model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport.config'); // Import Passport configuration
const adminTokenHandler = require('../middleware/checkAdminToken'); // Token middleware
const errorHandler = require('../middleware/errorMiddleware'); // Error handler middleware

const JWT_ADMIN_SECRET_KEY = process.env.JWT_ADMIN_SECRET_KEY;

// Helper function to create a response
function createResponse(ok, message, data = null) {
  return { ok, message, data };
}

// Admin Registration Route
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if the admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(409)
        .json(createResponse(false, 'Admin with this email already exists'));
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Admin object
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword, // Store hashed password
    });

    await newAdmin.save(); // Save the admin to the database

    res.status(201).json(createResponse(true, 'Admin registered successfully'));
  } catch (err) {
    next(err); // Pass error to middleware
  }
});

// Admin Login Route
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json(createResponse(false, 'Invalid admin credentials'));
    }

    console.log('Admin found:', admin);

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json(createResponse(false, 'Invalid admin credentials'));
    }

    console.log('Password match:', isMatch);

    // Generate an authentication token for the admin
    const adminAuthToken = jwt.sign(
      { adminId: admin._id, role: 'admin' },
      JWT_ADMIN_SECRET_KEY,
      { expiresIn: '10m' }
    );

    // Set the auth token in an HTTP-only cookie
    res.cookie('adminAuthToken', adminAuthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'Strict', // Prevent CSRF attacks
    });

    res.status(200).json(createResponse(true, 'Admin login successful', { adminAuthToken }));
  } catch (err) {
    next(err); // Pass error to middleware
  }
});

// Check Admin Login Route
router.get('/checklogin', adminTokenHandler, (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Admin authenticated successfully',
    adminId: req.adminId, // Retrieved from token
  });
});

// Use error handling middleware
router.use(errorHandler);

module.exports = router;
