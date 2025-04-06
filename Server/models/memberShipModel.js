const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    planDuration: {
      type: String,
      required: true,
      enum: ["One Month", "Three Months", "Six Months", "One Year"], // example durations
    },
    features: {
      type: [String],
      default: [],
    },
    mostPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const MembershipPlan = mongoose.model.MembershipPlan || mongoose.model("MembershipPlan", planSchema);

module.exports = MembershipPlan;
