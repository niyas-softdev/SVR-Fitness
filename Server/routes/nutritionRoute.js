const express = require('express');
const router = express.Router();
const { createNutritionPlan, getAllPlans, getPlanById } = require('../controllers/nutritionController');

router.post('/create', createNutritionPlan);
router.get('/get', getAllPlans);
router.get('/get/:id', getPlanById);

module.exports = router;
