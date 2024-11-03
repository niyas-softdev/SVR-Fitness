const express = require("express");
const router = express.Router();
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

const {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,productCount
} = require("../controllers/productController");

router.get("/get", getProduct);

router.get("/productCount",productCount)

router.post(
  "/create",
  // passport.authenticate("jwt", { session: false }),
 // checkRole("admin"),
  createProduct
);

router.put(
  "/update/:id",
 // passport.authenticate("jwt", { session: false }),
 
  //checkRole("admin"),
  updateProduct
);

router.delete(
  "/delete/:id",
  //passport.authenticate("jwt", { session: false }),
  
 // checkRole("admin"),
  deleteProduct
);

module.exports = router;
