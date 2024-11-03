const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true, unique: true },
    password: { type: String },
    phoneNumber: { type: String },
    userId: {
      type: String,
      unique: true // Ensure the userId is unique
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user"
    },
    weight: [
      {
        weight: { type: Number, min: 0 },
        date: { type: Date }
      }
    ],
    height: [
      {
        height: { type: Number, min: 0 },
        date: { type: Date }
      }
    ],
    gender: { type: String },
    dob: { type: Date },
    goal: { type: String },
    calorieIntake: [
      {
        item: { type: String },
        date: { type: Date },
        quantity: { type: Number },
        quantitytype: { type: String },
        calorieIntake: { type: Number, min: 0 }
      }
    ],
    plan: {
      type: String
    },
    planDate: {
      type: Date
    },

    planDuration: {
      type: Number
    }, // Plan duration in months (1, 3, 6, 12)
    expiryDate: { type: Date }, // Expiry date calculated based on the plan
    planStatus: {
      type: Boolean,
      default: false
    },
    activityLevel: { type: String },
    sleep: [
      {
        date: { type: Date },
        durationInHrs: { type: Number, min: 0 }
      }
    ],
    steps: [
      {
        date: { type: Date },
        steps: { type: Number, min: 0 }
      }
    ],
    workouts: [
      {
        date: { type: Date },
        exercise: { type: String },
        durationInMinutes: { type: Number, min: 0 }
      }
    ],
    water: [
      {
        date: { type: Date },
        amountInMilliliters: { type: Number, min: 0 }
      }
    ],
    token: { type: String },
    resetPasswordExpires: { type: Date },
    ACaccessToken: { type: String },
    ACaccessTokenExpiresAt: { type: Number },
    ACrefreshToken: { type: String },
    ACrefreshTokenExpiresAt: { type: Number }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
