const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile } = require("../controllers/profileController");

// Get user profile
router.get("/get/:id", getUserProfile);

// Update user profile
router.put("/update", updateUserProfile);

module.exports = router;
