const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  cartQuantity: {
    type: Number,
    default: 1
  }
});

const Cart = mongoose.model.Cart || mongoose.model("Cart", CartSchema);

module.exports = Cart;
