// workoutData.jsx

export const workoutPlans = {
  men: {
    build_muscle: {
      beginner: [
        {
          day: "Monday",
          exercises: [
            { name: "Bench Press", sets: 3, reps: 10, rest: "60 seconds" },
            { name: "Squats", sets: 3, reps: 12, rest: "60 seconds" },
            {
              name: "Dumbbell Shoulder Press",
              sets: 3,
              reps: 10,
              rest: "60 seconds"
            },
            { name: "Lat Pulldown", sets: 3, reps: 12, rest: "60 seconds" }
          ]
        },
        {
          day: "Tuesday",
          exercises: [
            {
              name: "Incline Bench Press",
              sets: 3,
              reps: 10,
              rest: "60 seconds"
            },
            { name: "Leg Press", sets: 3, reps: 12, rest: "60 seconds" },
            {
              name: "Dumbbell Bicep Curls",
              sets: 3,
              reps: 12,
              rest: "60 seconds"
            },
            { name: "Tricep Dips", sets: 3, reps: 10, rest: "60 seconds" }
          ]
        },
        {
          day: "Wednesday",
          exercises: [
            { name: "Deadlifts", sets: 4, reps: 8, rest: "90 seconds" },
            { name: "Pull-ups", sets: 4, reps: 8, rest: "90 seconds" },
            { name: "Barbell Rows", sets: 3, reps: 10, rest: "60 seconds" },
            { name: "Lunges", sets: 3, reps: 12, rest: "60 seconds" }
          ]
        },
        {
          day: "Thursday",
          exercises: [
            {
              name: "Overhead Military Press",
              sets: 4,
              reps: 10,
              rest: "60 seconds"
            },
            { name: "Leg Curl", sets: 4, reps: 12, rest: "60 seconds" },
            { name: "Hammer Curls", sets: 3, reps: 10, rest: "60 seconds" },
            { name: "Tricep Pushdown", sets: 3, reps: 12, rest: "60 seconds" }
          ]
        },
        {
          day: "Friday",
          exercises: [
            { name: "Squats", sets: 4, reps: 10, rest: "90 seconds" },
            { name: "Flat Bench Press", sets: 4, reps: 10, rest: "90 seconds" },
            { name: "Lat Pulldown", sets: 4, reps: 12, rest: "60 seconds" },
            { name: "Leg Extensions", sets: 4, reps: 12, rest: "60 seconds" }
          ]
        },
        {
          day: "Saturday",
          exercises: [
            { name: "Deadlifts", sets: 4, reps: 8, rest: "90 seconds" },
            { name: "Dumbbell Rows", sets: 4, reps: 10, rest: "60 seconds" },
            { name: "Leg Press", sets: 4, reps: 12, rest: "60 seconds" },
            { name: "Calf Raises", sets: 4, reps: 15, rest: "60 seconds" }
          ]
        }
      ],
      intermediate: [
        {
          day: "Monday",
          exercises: [
            {
              name: "Incline Bench Press",
              sets: 4,
              reps: 8,
              rest: "90 seconds"
            },
            { name: "Squat", sets: 4, reps: 10, rest: "90 seconds" },
            { name: "Overhead Press", sets: 4, reps: 10, rest: "60 seconds" },
            { name: "Seated Row", sets: 4, reps: 10, rest: "60 seconds" }
          ]
        },
        {
          day: "Wednesday",
          exercises: [
            { name: "Deadlift", sets: 4, reps: 8, rest: "90 seconds" },
            { name: "Lat Pulldown", sets: 4, reps: 10, rest: "90 seconds" },
            { name: "Barbell Rows", sets: 4, reps: 10, rest: "60 seconds" },
            { name: "Leg Curl", sets: 4, reps: 12, rest: "60 seconds" }
          ]
        }
      ]
    },
    lose_fat: {
      beginner: [
        {
          day: "Monday",
          exercises: [
            {
              name: "Jumping Jacks",
              sets: 3,
              reps: "1 min",
              rest: "30 seconds"
            },
            { name: "Push-ups", sets: 3, reps: 15, rest: "30 seconds" },
            {
              name: "Bodyweight Squats",
              sets: 3,
              reps: 20,
              rest: "30 seconds"
            },
            {
              name: "Mountain Climbers",
              sets: 3,
              reps: "1 min",
              rest: "30 seconds"
            }
          ]
        },
        {
          day: "Tuesday",
          exercises: [
            { name: "High Knees", sets: 3, reps: "1 min", rest: "30 seconds" },
            { name: "Lunges", sets: 3, reps: 12, rest: "30 seconds" },
            { name: "Plank", sets: 3, reps: "1 min", rest: "30 seconds" },
            { name: "Jump Rope", sets: 3, reps: "1 min", rest: "30 seconds" }
          ]
        }
      ]
    }
  },
  women: {
    build_muscle: {
      beginner: [
        {
          day: "Monday",
          exercises: [
            { name: "Hip Thrust", sets: 3, reps: 12, rest: "60 seconds" },
            { name: "Leg Press", sets: 3, reps: 12, rest: "60 seconds" },
            {
              name: "Dumbbell Shoulder Press",
              sets: 3,
              reps: 12,
              rest: "60 seconds"
            },
            { name: "Seated Row", sets: 3, reps: 10, rest: "60 seconds" }
          ]
        },
        {
          day: "Wednesday",
          exercises: [
            { name: "Lat Pulldown", sets: 3, reps: 10, rest: "60 seconds" },
            { name: "Leg Curl", sets: 3, reps: 12, rest: "60 seconds" },
            { name: "Push-up", sets: 3, reps: 10, rest: "60 seconds" },
            {
              name: "Dumbbell Shoulder Press",
              sets: 3,
              reps: 10,
              rest: "60 seconds"
            }
          ]
        }
      ],
      intermediate: [
        {
          day: "Monday",
          exercises: [
            { name: "Squats", sets: 4, reps: 10, rest: "90 seconds" },
            { name: "Lunges", sets: 4, reps: 12, rest: "90 seconds" },
            { name: "Leg Press", sets: 4, reps: 12, rest: "90 seconds" },
            { name: "Bench Press", sets: 4, reps: 8, rest: "90 seconds" }
          ]
        },
        {
          day: "Wednesday",
          exercises: [
            {
              name: "Romanian Deadlift",
              sets: 4,
              reps: 10,
              rest: "90 seconds"
            },
            { name: "Leg Extension", sets: 4, reps: 12, rest: "90 seconds" },
            { name: "Lat Pulldown", sets: 4, reps: 10, rest: "90 seconds" },
            {
              name: "Incline Dumbbell Press",
              sets: 4,
              reps: 8,
              rest: "90 seconds"
            }
          ]
        }
      ]
    }
  }
};
