const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/userModel");
const MembershipGetAllPlanModel = require("../models/memberShipModel");
const MembershipPaymentModel = require("../models/membershipPayments");
const Payment = require("../models/PaymentModel");
const Product = require("../models/productModel");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order for membership plan
exports.createMembershipOrder = async (req, res) => {
  const { userId, membershipPlan } = req.body;

  if (!userId || !membershipPlan) {
    return res.status(400).json({ message: "userId and membershipPlan are required" });
  }

  try {
    // 🔍 Find the plan details
    const plan = await MembershipGetAllPlanModel.findById(membershipPlan);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // 🧾 Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.price * 100, // amount in paise
      currency: "INR",
      receipt: `membership_${Date.now()}`,
    });

    // 💾 Save order in MembershipPayment model
    const payment = new MembershipPaymentModel({
      user: userId,
      membershipPlan,
      razorpayOrderId: order.id,
      paymentStatus: "pending",
    });
    await payment.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Create Membership Order Error:", error);
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
  } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const digest = hmac.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    // ✅ Find the payment entry and update it
    const payment = await MembershipPaymentModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: "completed",
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // 🧠 Calculate and update user's membership info
    const plan = await MembershipGetAllPlanModel.findById(payment.membershipPlan);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const planDate = new Date();
    const expiryDate = new Date(planDate);
    let duration = 1;

    if (typeof plan.planDuration === "number") {
      duration = plan.planDuration;
    } else if (typeof plan.planDuration === "string") {
      // Optional: map string durations if needed
      const map = {
        "One Month": 1,
        "Three Months": 3,
        "Six Months": 6,
        "One Year": 12,
      };
      duration = map[plan.planDuration] || 1;
    }

    expiryDate.setMonth(expiryDate.getMonth() + duration);

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        plan: plan.name,
        planDuration: duration,
        planDate,
        expiryDate,
        planStatus: true,
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Payment confirmed", user, payment });
  } catch (err) {
    console.error("Confirm Membership Payment Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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


exports.getUserPlanDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const payment = await MembershipPaymentModel.findOne({
      user: userId,
      paymentStatus: "completed",
    })
      .sort({ createdAt: -1 })
      .populate("membershipPlan");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "No completed plan/payment found for this user",
      });
    }

    const purchaseDate = payment.createdAt;
    const planDurationStr = payment.membershipPlan.planDuration;

    // Convert duration string to number of months
    const durationMap = {
      "One Month": 1,
      "Three Months": 3,
      "Six Months": 6,
      "One Year": 12,
    };
    const durationInMonths = durationMap[planDurationStr] || 1;

    const expiryDate = new Date(purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + durationInMonths);

    const today = new Date();
    const timeDiff = expiryDate - today;
    const daysToExpire = Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 0);
    const isActive = daysToExpire > 0;

    // ✅ Use return here
    return res.status(200).json({
      success: true,
      message: "User plan details fetched",
      data: {
        plan: {
          name: payment.membershipPlan.name,
          price: payment.membershipPlan.price,
          features: payment.membershipPlan.features,
          mostPopular: payment.membershipPlan.mostPopular,
          duration: planDurationStr,
        },
        status: {
          purchaseDate,
          expiryDate,
          daysToExpire,
          planStatus: isActive ? "Active" : "Inactive",
        },
      },
    });
  } catch (err) {
    console.error("Error fetching user plan:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.getAllMembershipPayments = async (req, res) => {
  try {
    const payments = await MembershipPaymentModel.find()
      .populate("user", "name email")
      .populate("membershipPlan", "name price");

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: err.message,
    });
  }
};

exports.getAllProductOrders = async (req, res) => {
  try {
    const payments = await Payment.find();

    // Collect all unique productIds from all payments
    const allProductIds = [];
    payments.forEach(payment => {
      payment.items.forEach(item => {
        if (!allProductIds.includes(item.productId)) {
          allProductIds.push(item.productId);
        }
      });
    });

    // Fetch product details for those IDs
    const products = await Product.find({
      _id: { $in: allProductIds },
    });

    // Map productId to product object for fast lookup
    const productMap = {};
    products.forEach((product) => {
      productMap[product._id.toString()] = product;
    });

    // Attach product details to payment items
    const enrichedPayments = payments.map((payment) => ({
      ...payment.toObject(),
      items: payment.items.map((item) => ({
        ...item,
        product: productMap[item.productId] || null,
      })),
    }));

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: enrichedPayments,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product orders",
      error: error.message,
    });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus, userId } = req.body;
    const orderId = req.params.id; // match with frontend

    if (!deliveryStatus || !userId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (deliveryStatus, userId, orderId)",
      });
    }

    const updated = await Payment.findOneAndUpdate(
      { _id: orderId, userId },
      { deliveryStatus },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not owned by this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery status updated",
      data: updated,
    });
  } catch (err) {
    console.error("Update Delivery Status Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.checkMembershipStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: userId",
      });
    }

    const membership = await MembershipPaymentModel.findOne({
      user: userId,
      paymentStatus: "completed",
    });

    if (!membership) {
      return res.status(200).json({
        success: true,
        hasMembership: false,
        message: "No active membership found",
      });
    }

    res.status(200).json({
      success: true,
      hasMembership: true,
      message: "Active membership found",
    });
  } catch (err) {
    console.error("Check Membership Status Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
