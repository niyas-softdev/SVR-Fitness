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

    res
      .status(200)
      .json({ message: "Item removed from cart successfully", productId });
  } catch (error) {
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
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.find((item) => item.productId.equals(productId));

    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (quantity > 0) {
      item.quantity = quantity;
    } else {
      cart.items = cart.items.filter(
        (item) => !item.productId.equals(productId)
      );
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({ error: "Failed to update item quantity" });
  }
};

// Fetch cart items
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  console.log("Received request to fetch cart for userId:", userId);

  try {
    // Fetch all cart items for the user
    const cartItems = await Cart.find({ userId }).populate("productId");
    console.log("Cart items fetched from database:", cartItems);

    if (!cartItems || cartItems.length === 0) {
      console.log("No cart items found for userId:", userId);
      return res.status(404).json({ error: "Cart is empty or not found" });
    }

    // Map cart items to include product details and quantity
    const detailedCartItems = cartItems
      .filter((item) => !!item.productId) // Ensure valid products
      .map((item) => {
        const product = item.productId;
        return {
          id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          images: product.imageUrl ? [product.imageUrl] : [],
          quantity: item.cartQuantity // Here, the cart quantity is included
        };
      });

    console.log("Detailed cart items prepared:", detailedCartItems);

    // Respond with the detailed cart items
    res.status(200).json({ userId, items: detailedCartItems });
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch cart. Please try again later." });
  }
};
