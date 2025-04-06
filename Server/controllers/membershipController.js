const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/userModel");
const MembershipGetAllPlanModel = require("../models/memberShipModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order for membership plan
exports.createMembershipOrder = async (req, res) => {
  const { userId, plan, amount, planDuration } = req.body;
  if (!userId || !plan || !amount || !planDuration) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `membership_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// Confirm Razorpay membership payment and update user
exports.confirmMembershipPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    plan,
    planDuration
  } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const digest = hmac.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const planDate = new Date();
  const expiryDate = new Date(planDate);
  expiryDate.setMonth(expiryDate.getMonth() + parseInt(planDuration));

  try {
    const user = await User.findOneAndUpdate(
      { userId },
      {
        plan,
        planDuration,
        planDate,
        expiryDate,
        planStatus: true,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Payment confirmed", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get membership info
exports.getMembership = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      data: {
        plan: user.plan,
        planStatus: user.planStatus,
        planDate: user.planDate,
        expiryDate: user.expiryDate,
        planDuration: user.planDuration,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cancel/Delete membership
exports.deleteMembership = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { userId },
      {
        plan: null,
        planDuration: null,
        planDate: null,
        expiryDate: null,
        planStatus: false,
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ success: true, message: "Membership deleted", user });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete membership", error: err });
  }
};
exports.getPlan = async (req, res) => {
  try {
    const plans = await MembershipGetAllPlanModel.find();

    if (!plans || plans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No plans found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      data: plans,
    });
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
      error: error.message,
    });
  }
};
