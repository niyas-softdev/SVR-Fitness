const express = require("express");
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require("../controllers/userController");
const { verifyToken, verifyRole } = require("../middleware/checkAuthToken"); // Ensure the correct path to middleware

// Route to get all users (admin access only)
router.get("/get", verifyToken, verifyRole(["admin"]), getUsers);

// Route to create a new user (admin access only)
router.post("/create", verifyToken, verifyRole(["admin"]), createUser);

// Route to update an existing user by ID (admin access only)
router.put("/update/:id", verifyToken, verifyRole(["admin"]), updateUser);

// Route to delete a user by ID (admin access only)
router.delete("/delete/:id", verifyToken, verifyRole(["admin"]), deleteUser);

module.exports = router;
