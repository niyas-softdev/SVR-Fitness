const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  userCount,
  expiredUsers,
  searchUsers,
  getExpiredUserCount,
  resetUserId 
} = require("../controllers/userController");
const passport = require("passport");
const { isAuthenticated } = require("../middleware/checkAuthToken");


// Middleware function to check user role
const checkRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    res.status(403).json({ message: "Access forbidden" });
  }
};


router.put('/resetUserId/:id', resetUserId);

// Route to get all users (admin access only)
router.get(
  "/get",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log("Authenticated User:", req.user); // Log the user to verify JWT decoding
    next();
  },
  // isAuthenticated,
  checkRole("admin"),
  getUsers
); // Route to get all users (admin access only)


// Route to search users by name
router.get("/search", searchUsers);

router.get(
  "/userCount",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log("Authenticated User:", req.user); // Log the user to verify JWT decoding
    next();
  },
  // isAuthenticated,
  checkRole("admin"),
  userCount
);

router.get(
  "/expiredUsers",
  expiredUsers
);

router.get(
  "/getExpiredUserCount",
  getExpiredUserCount
);



// Route to create a new user (admin access only)
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated,
  checkRole("admin"),
  createUser
);

// Route to update an existing user by ID (admin access only)
router.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  // isAuthenticated,
  // checkRole("admin"),
  updateUser
);

// Route to delete a user by ID (admin access only)
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated,
  checkRole("admin"),
  deleteUser
);

module.exports = router;
