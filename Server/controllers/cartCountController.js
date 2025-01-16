const CartModel = require("../models/cartModel");
const mongoose = require("mongoose");

// Get Cart Count
exports.getCartCount = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate User ID
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing User ID" });
    }

    console.log("User ID received:", userId);

    // Fetch the count of cart items for the user
    const cartCount = await CartModel.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalQuantity: { $sum: "$cartQuantity" } } }
    ]);

    const totalQuantity = cartCount.length > 0 ? cartCount[0].totalQuantity : 0;

    console.log("Cart count fetched:", totalQuantity);

    res.status(200).json({
      message: "Cart count fetched successfully",
      cartCount: totalQuantity,
    });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
