const Nutrition = require('../models/nutritionModel');

// Create a new nutrition plan
const createNutritionPlan = async (req, res) => {
  const { height, weight, age, activityLevel, dietPlan } = req.body;

  try {
    const newPlan = new Nutrition({
      height,
      weight,
      age,
      activityLevel,
      dietPlan,
    });

    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all nutrition plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await Nutrition.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single plan by ID
const getPlanById = async (req, res) => {
  try {
    const plan = await Nutrition.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNutritionPlan,
  getAllPlans,
  getPlanById,
};
