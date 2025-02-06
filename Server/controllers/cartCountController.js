const CartModel = require("../models/cartModel");
const mongoose = require("mongoose");

// Get Cart Count (Distinct Products)
exports.getCartCount = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate User ID
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing User ID" });
    }

    console.log("User ID received:", userId);

    // Convert userId to ObjectId properly
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // Fetch the count of distinct products in the user's cart
    const productCount = await CartModel.aggregate([
      { $match: { userId: objectIdUserId } }, // Match cart items for the user
      { $group: { _id: "$productId" } }, // Group by productId
      { $count: "distinctProducts" }, // Count the distinct productId entries
    ]);

    const distinctProducts = productCount.length > 0 ? productCount[0].distinctProducts : 0;

    console.log("Distinct products in cart:", distinctProducts);

    res.status(200).json({
      message: "Cart count fetched successfully",
      cartCount: distinctProducts,
    });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
