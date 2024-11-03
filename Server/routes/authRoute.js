const express = require("express");
const {
  signUp,
  signIn,
  googleLogin
} = require("../controllers/authController");
const router = express.Router();

// Registration Route
router.post("/register", signUp);

// Login Route
router.post("/login", signIn);

// Google Login
router.post("/googleLogin", googleLogin);

module.exports = router;
