const MembershipPlan = require("../models/memberShipModel");

const getMembershipPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find().sort({ price: 1 }); // sort by price ascending
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

module.exports = { getMembershipPlans };
