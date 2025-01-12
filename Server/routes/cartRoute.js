const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart
} = require("../controllers/cartController");
const { getCartCount } = require("../controllers/cartCountController");

router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.post("/update", updateCartItemQuantity);
router.get("/:userId", getCart);
router.get("/cartCount/:userId", getCartCount);

module.exports = router;
