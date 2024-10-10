import { useState } from "react";
import { workoutPlans } from "../datas/workoutDatas"; // Import workout data

const WorkoutPlan = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);

  const handleFilter = () => {
    const result = workoutPlans.filter(
      (plan) =>
        plan.category === selectedCategory &&
        plan.goal === selectedGoal &&
        plan.level === selectedLevel
    );
    setFilteredWorkouts(result);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Workout Plan</h1>

      <div className="flex flex-wrap justify-center space-x-4 mb-8">
        <select
          className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>

        <select
          className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          value={selectedGoal}
          onChange={(e) => setSelectedGoal(e.target.value)}
        >
          <option value="">Select Goal</option>
          <option value="bulking">Bulking</option>
          <option value="cutting">Cutting</option>
        </select>

        <select
          className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="">Select Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={handleFilter}
        >
          Get Plan
        </button>
      </div>

      {filteredWorkouts.length > 0 ? (
        filteredWorkouts.map((plan, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {plan.goal} Plan ({plan.level})
            </h2>
            {plan.workouts.map((workout, idx) => (
              <div
                key={idx}
                className="mb-6 p-4 bg-white rounded-lg shadow-lg transition transform hover:scale-105"
              >
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  {workout.day}
                </h3>
                <ul className="space-y-2">
                  {workout.exercises.map((exercise, i) => (
                    <li key={i} className="text-gray-600">
                      <span className="font-semibold">{exercise.name}</span>: {exercise.sets} sets x {exercise.reps} reps (Rest: {exercise.rest})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No plans available. Please select different options.</p>
      )}
    </div>
  );
};

export default WorkoutPlan;
