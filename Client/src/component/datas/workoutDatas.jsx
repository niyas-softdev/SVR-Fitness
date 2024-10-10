export const workoutPlans = [
  {
    category: "men",
    goal: "bulking",
    level: "beginner",
    workouts: [
      {
        day: "Monday",
        exercises: [
          { name: "Bench Press", sets: 4, reps: 10, rest: "60 sec" },
          { name: "Incline Dumbbell Press", sets: 3, reps: 12, rest: "60 sec" },
          { name: "Push-Ups", sets: 3, reps: "until failure", rest: "60 sec" }
        ]
      },
      {
        day: "Tuesday",
        exercises: [
          { name: "Squats", sets: 4, reps: 10, rest: "90 sec" },
          { name: "Leg Press", sets: 3, reps: 12, rest: "90 sec" },
          { name: "Lunges", sets: 3, reps: 15, rest: "90 sec" }
        ]
      }
      // Add more days for the full week
    ]
  },
  {
    category: "women",
    goal: "cutting",
    level: "intermediate",
    workouts: [
      {
        day: "Monday",
        exercises: [
          { name: "Deadlift", sets: 4, reps: 10, rest: "90 sec" },
          { name: "Lat Pulldown", sets: 3, reps: 12, rest: "60 sec" },
          { name: "Dumbbell Row", sets: 3, reps: 12, rest: "60 sec" }
        ]
      },
      {
        day: "Tuesday",
        exercises: [
          { name: "Walking Lunges", sets: 3, reps: 15, rest: "90 sec" },
          { name: "Leg Curl", sets: 3, reps: 12, rest: "90 sec" },
          { name: "Step-Ups", sets: 3, reps: 12, rest: "90 sec" }
        ]
      }
      // Add more days for the full week
    ]
  }
  // Add more categories and plans
];
