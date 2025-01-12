const CartModel = require("../models/cartModel");
const mongoose = require("mongoose");

exports.getCartCount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log("User ID received:", userId);

    // Count the number of cart documents for the user
    const cartCount = await CartModel.countDocuments({ userId: userId });
    console.log("Cart count fetched:", cartCount);

    res.status(200).json({
      message: "Counts fetched successfully",
      cartCount
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
