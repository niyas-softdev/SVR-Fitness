const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Supplements", "Accessories"] // Predefined list of categories
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    },
    imageUrl: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);
const Product =
  mongoose.model.Product || mongoose.model("Product", productSchema);

module.exports = Product;
