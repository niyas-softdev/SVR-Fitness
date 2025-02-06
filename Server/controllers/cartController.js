const mongoose = require("mongoose");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Add item to cart
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "User ID and Product ID are required." });
    }

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Add or update the cart item
    await Cart.findOneAndUpdate(
      { userId, productId },
      { $inc: { cartQuantity: quantity || 1 } },
      { new: true, upsert: true } // Create if not exists
    );

    // Fetch the updated cart
    const updatedCart = await Cart.find({ userId }).populate("productId");

    // Calculate cartCount (distinct products)
    const cartCount = updatedCart.length;

    // Prepare the cart items response
    const cartItems = updatedCart.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      cartQuantity: item.cartQuantity,
    }));

    res.status(200).json({
      message: "Item added to cart successfully",
      cartCount,
      cart: cartItems,
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart." });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    if (!userId || !productId) {
      return res.status(400).json({ error: "User ID and Product ID are required." });
    }

    const cartItem = await Cart.findOne({ userId, productId });
    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart." });
    }

    // Remove the item from the cart
    await Cart.deleteOne({ userId, productId });

    // Fetch the updated cart for the user
    const updatedCart = await Cart.find({ userId }).populate("productId");

    // Calculate cart count and subtotal
    const cartCount = updatedCart.length; // Count of distinct products
    const subtotal = updatedCart.reduce(
      (total, item) => total + item.cartQuantity * item.productId.price,
      0
    );
    const totalCartQuantity = updatedCart.reduce((sum, item) => sum + item.cartQuantity, 0); // Sum of quantities

    // Extract product data for items
    const items = updatedCart.map((item) => ({
      ...item.productId._doc,
      cartQuantity: item.cartQuantity,
    }));

    // Respond with the updated cart details
    res.status(200).json({
      message: "Item removed from cart successfully",
      cart: { items, cartCount, subtotal, totalCartQuantity },
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Failed to remove item from cart." });
  }
};

// Update item quantity
exports.updateCartItemQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Validate input
    if (!userId || !productId || quantity === undefined) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Find and update the cart item
    const updatedCartItem = await Cart.findOneAndUpdate(
      { userId, productId },
      { $set: { cartQuantity: quantity } },
      { new: true } // Return the updated document
    );

    if (!updatedCartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Fetch all cart items for the user
    const userCartItems = await Cart.find({ userId }).populate("productId");

    // Calculate cart count, subtotal, and total cart quantity
    const cartCount = userCartItems.length; // Count of distinct products
    const subtotal = userCartItems.reduce(
      (total, item) => total + item.cartQuantity * item.productId.price,
      0
    );
    const totalCartQuantity = userCartItems.reduce((sum, item) => sum + item.cartQuantity, 0); // Sum of quantities

    // Extract product data for items
    const items = userCartItems.map((item) => ({
      ...item.productId._doc, // Extract product details
      cartQuantity: item.cartQuantity, // Include cart quantity
    }));

    // Respond with the updated cart details
    res.status(200).json({
      message: "Cart updated successfully",
      cart: { items, cartCount, subtotal, totalCartQuantity },
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({ error: "Failed to update cart item quantity" });
  }
};

// Fetch cart items
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await Cart.find({ userId }).populate("productId");

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        message: "Cart fetched successfully",
        cart: { items: [], cartCount: 0, subtotal: 0, totalCartQuantity: 0 },
      });
    }

    // Calculate cart count, subtotal, and total cart quantity
    const cartCount = cartItems.length; // Count of distinct products
    const subtotal = cartItems.reduce(
      (total, item) => total + item.cartQuantity * item.productId.price,
      0
    );
    const totalCartQuantity = cartItems.reduce(
      (sum, item) => sum + item.cartQuantity,
      0
    );

    // Map over cart items to format product data
    const items = cartItems
      .filter((item) => !!item.productId) // Ensure product data exists
      .map((item) => ({
        ...item.productId._doc, // Extract product details
        cartQuantity: item.cartQuantity, // Include cart quantity
      }));

    // Respond with the cart details
    res.status(200).json({
      message: "Cart fetched successfully",
      cart: { items, cartCount, subtotal, totalCartQuantity },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch cart. Please try again later." });
  }
};
