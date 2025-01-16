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

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const updatedCartItem = await Cart.findOneAndUpdate(
      { userId, productId },
      { $inc: { cartQuantity: quantity || 1 } },
      { new: true, upsert: true }
    ).populate("productId");

    const updatedCart = await Cart.find({ userId }).populate("productId");
    res.status(200).json({
      message: "Item added to cart successfully",
      cart: updatedCart.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        cartQuantity: item.cartQuantity
      }))
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart." });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "User ID and Product ID are required." });
    }

    const cartItem = await Cart.findOne({ userId, productId });
    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart." });
    }

    await Cart.deleteOne({ userId, productId });

    const updatedCart = await Cart.find({ userId });
    const cartCount = updatedCart.reduce(
      (count, item) => count + (item.cartQuantity || 0),
      0
    );

    res.status(200).json({
      message: "Item removed from cart successfully",
      productId,
      cartCount,
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Failed to remove item from cart." });
  }
};



// Update item quantity
exports.updateCartItemQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    return res.status(400).json({ error: "Invalid userId or productId" });
  }

  try {
    const cartItem = await Cart.findOne({ userId, productId });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (quantity > 0) {
      cartItem.cartQuantity = quantity;
      await cartItem.save();
    } else {
      await Cart.deleteOne({ userId, productId });
    }

    const updatedCart = await Cart.find({ userId });

    const cartCount = updatedCart.reduce(
      (total, item) => total + item.cartQuantity,
      0
    );

    res.status(200).json({
      message: "Cart updated successfully",
      cart: { items: updatedCart, cartCount }
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
      return res.status(200).json({ userId, items: [] });
    }

    const detailedCartItems = cartItems
      .filter((item) => !!item.productId)
      .map((item) => {
        const product = item.productId;
        return {
          id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          images: product.imageUrl ? [product.imageUrl] : [],
          quantity: item.cartQuantity,
        };
      });

    res.status(200).json({ userId, items: detailedCartItems });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch cart. Please try again later." });
  }
};

