const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  height: {
    type: Number, // height in cm or meters
    required: true,
  },
  weight: {
    type: Number, // weight in kg
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  activityLevel: {
    type: String, // sedentary, active, very active, etc.
    required: true,
  },
  dietPlan: {
    type: String, // bulking, cutting, maintenance, etc.
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Nutrition', nutritionSchema);
