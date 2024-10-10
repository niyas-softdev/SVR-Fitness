export const nutritionData = [
  {
    category: "bulking",
    gender: "male",
    dietType: "vegetarian",
    details: {
      minHeight: 170,
      maxHeight: 190,
      minWeight: 60,
      maxWeight: 85,
      minAge: 18,
      maxAge: 30,
      activityLevel: "active", // Corrected to valid activity level
      calories: 3200,
      meals: {
        breakfast: [
          {
            name: "Oats with Almond Butter",
            quantity: "1 bowl",
            calories: 350,
            protein: 12,
            carbs: 60,
            fats: 12
          },
          {
            name: "Greek Yogurt",
            quantity: "200g",
            calories: 120,
            protein: 15,
            carbs: 10,
            fats: 5
          }
        ],
        lunch: [
          {
            name: "Quinoa Salad with Tofu",
            quantity: "1 bowl",
            calories: 450,
            protein: 25,
            carbs: 50,
            fats: 15
          },
          {
            name: "Whole Wheat Roti",
            quantity: "2 pieces",
            calories: 200,
            protein: 6,
            carbs: 40,
            fats: 4
          }
        ],
        dinner: [
          {
            name: "Lentil Soup",
            quantity: "1 bowl",
            calories: 350,
            protein: 20,
            carbs: 60,
            fats: 8
          },
          {
            name: "Grilled Vegetables",
            quantity: "1 plate",
            calories: 150,
            protein: 5,
            carbs: 20,
            fats: 8
          }
        ]
      }
    }
  },
  {
    category: "maintenance",
    gender: "female",
    dietType: "non-vegetarian",
    details: {
      minHeight: 150,
      maxHeight: 170,
      minWeight: 55,
      maxWeight: 70,
      minAge: 25,
      maxAge: 40,
      activityLevel: "active", // Corrected to valid activity level
      calories: 2200,
      meals: {
        breakfast: [
          {
            name: "Boiled Eggs",
            quantity: "3 eggs",
            calories: 210,
            protein: 18,
            carbs: 1,
            fats: 14
          },
          {
            name: "Whole Wheat Toast",
            quantity: "2 slices",
            calories: 160,
            protein: 8,
            carbs: 30,
            fats: 2
          }
        ],
        lunch: [
          {
            name: "Grilled Chicken Salad",
            quantity: "1 bowl",
            calories: 350,
            protein: 35,
            carbs: 15,
            fats: 18
          },
          {
            name: "Brown Rice",
            quantity: "1 cup",
            calories: 215,
            protein: 5,
            carbs: 45,
            fats: 2
          }
        ],
        dinner: [
          {
            name: "Salmon with Quinoa",
            quantity: "150g Salmon, 1 cup Quinoa",
            calories: 500,
            protein: 40,
            carbs: 55,
            fats: 20
          },
          {
            name: "Steamed Vegetables",
            quantity: "1 cup",
            calories: 60,
            protein: 3,
            carbs: 10,
            fats: 2
          }
        ]
      }
    }
  },
  {
    category: "cutting",
    gender: "male",
    dietType: "non-vegetarian",
    details: {
      minHeight: 180,
      maxHeight: 200,
      minWeight: 75,
      maxWeight: 95,
      minAge: 20,
      maxAge: 35,
      activityLevel: "very active", // Valid activity level
      calories: 2000,
      meals: {
        breakfast: [
          {
            name: "Scrambled Eggs",
            quantity: "4 eggs",
            calories: 320,
            protein: 25,
            carbs: 2,
            fats: 22
          },
          {
            name: "Mixed Berries",
            quantity: "1 cup",
            calories: 80,
            protein: 1,
            carbs: 18,
            fats: 0
          }
        ],
        lunch: [
          {
            name: "Turkey Breast Wrap",
            quantity: "1 wrap",
            calories: 300,
            protein: 35,
            carbs: 25,
            fats: 10
          },
          {
            name: "Carrot Sticks",
            quantity: "1 cup",
            calories: 50,
            protein: 1,
            carbs: 12,
            fats: 0
          }
        ],
        dinner: [
          {
            name: "Grilled Steak",
            quantity: "200g",
            calories: 450,
            protein: 50,
            carbs: 0,
            fats: 28
          },
          {
            name: "Steamed Broccoli",
            quantity: "1 cup",
            calories: 50,
            protein: 4,
            carbs: 10,
            fats: 1
          }
        ]
      }
    }
  },
  {
    category: "maintenance",
    gender: "male",
    dietType: "vegetarian",
    details: {
      minHeight: 175,
      maxHeight: 195,
      minWeight: 70,
      maxWeight: 85,
      minAge: 30,
      maxAge: 45,
      activityLevel: "sedentary", // Valid activity level
      calories: 2400,
      meals: {
        breakfast: [
          {
            name: "Smoothie with Banana and Peanut Butter",
            quantity: "1 glass",
            calories: 400,
            protein: 15,
            carbs: 60,
            fats: 18
          }
        ],
        lunch: [
          {
            name: "Paneer Curry",
            quantity: "200g",
            calories: 300,
            protein: 20,
            carbs: 15,
            fats: 20
          },
          {
            name: "Brown Rice",
            quantity: "1 cup",
            calories: 215,
            protein: 5,
            carbs: 45,
            fats: 2
          }
        ],
        dinner: [
          {
            name: "Vegetable Stir Fry",
            quantity: "1 bowl",
            calories: 250,
            protein: 8,
            carbs: 40,
            fats: 8
          }
        ]
      }
    }
  },
  {
    category: "bulking",
    gender: "female",
    dietType: "vegetarian",
    details: {
      minHeight: 155,
      maxHeight: 170,
      minWeight: 50,
      maxWeight: 65,
      minAge: 20,
      maxAge: 35,
      activityLevel: "very active", // Valid activity level
      calories: 2700,
      meals: {
        breakfast: [
          {
            name: "Avocado Toast",
            quantity: "2 slices",
            calories: 300,
            protein: 8,
            carbs: 40,
            fats: 20
          }
        ],
        lunch: [
          {
            name: "Chickpea Salad",
            quantity: "1 bowl",
            calories: 350,
            protein: 18,
            carbs: 50,
            fats: 10
          }
        ],
        dinner: [
          {
            name: "Veggie Pasta with Pesto",
            quantity: "1 plate",
            calories: 600,
            protein: 15,
            carbs: 75,
            fats: 20
          }
        ]
      }
    }
  }
];
