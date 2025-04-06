const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    purchasedAt:  {
      type: Date,
      default: Date.now,
    },
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    items: [
      {
        productId: String,
        quantity: Number,
      },
    ],
    customerDetails: Object,
  },
 {
    timestamps: true,}
  
);

module.exports = mongoose.model("Payment", paymentSchema);
