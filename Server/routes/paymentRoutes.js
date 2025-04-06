const express = require("express");
const router = express.Router();
const {
  createOrder,
  confirmPayment,
  getOrderHistory,
} = require("../controllers/paymentController");

// Create Razorpay order
router.post("/create-order", createOrder);

// Confirm payment
router.post("/confirm-payment", confirmPayment);

// Get order history
router.get("/order-history/:userId", getOrderHistory);

module.exports = router;
