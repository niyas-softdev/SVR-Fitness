import { useState } from "react";
import { nutritionData } from "../datas/nutritionDatas"; // Import the JSON data

const NutritionForm = () => {
  const [formData, setFormData] = useState({
    height: null,
    weight: null,
    age: null,
    gender: "",
    activityLevel: "",
    dietPlan: "",
    dietType: "", // Add dietType to formData
  });

  const [filteredData, setFilteredData] = useState(null);
  const [error, setError] = useState(""); // State to track errors

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert number fields (height, weight, age) to numbers
    const newValue =
      ["height", "weight", "age"].includes(name) ? parseInt(value, 10) || "" : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if nutritionData exists
    if (!nutritionData || nutritionData.length === 0) {
      setError("No nutrition data available. Please check your data source.");
      setFilteredData(null);
      return;
    }

    // Filter the nutrition data based on user input
    const result = nutritionData.filter((plan) => {
      const matches =
        (formData.height === null || (formData.height >= plan.details.minHeight && formData.height <= plan.details.maxHeight)) &&
        (formData.weight === null || (formData.weight >= plan.details.minWeight && formData.weight <= plan.details.maxWeight)) &&
        (formData.age === null || (formData.age >= plan.details.minAge && formData.age <= plan.details.maxAge)) &&
        (formData.gender === "" || plan.gender === formData.gender) &&
        (formData.activityLevel === "" || plan.details.activityLevel === formData.activityLevel) &&
        (formData.dietPlan === "" || plan.category === formData.dietPlan) &&
        (formData.dietType === "" || plan.dietType === formData.dietType);

      return matches;
    });

    if (result.length > 0) {
      setFilteredData(result[0].details);
      setError(""); // Clear any existing errors if a match is found
    } else {
      setError("No matching nutrition plan found. Please adjust your inputs.");
      setFilteredData(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-md shadow-xl transform transition-all duration-500 hover:scale-105">
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">Nutrition Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-gray-700">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Activity Level</label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
          >
            <option value="">Select Activity Level</option>
            <option value="sedentary">Sedentary</option>
            <option value="active">Active</option>
            <option value="very active">Very Active</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Diet Plan</label>
          <select
            name="dietPlan"
            value={formData.dietPlan}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
          >
            <option value="">Select Diet Plan</option>
            <option value="bulking">Bulking</option>
            <option value="cutting">Cutting</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Diet Type</label>
          <select
            name="dietType"
            value={formData.dietType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
          >
            <option value="">Select Diet Type</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Submit
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md animate-bounce">
          <p>{error}</p>
        </div>
      )}

      {/* Filtered Data Table */}
      {filteredData && (
  <table className="mt-6 w-full border-collapse rounded-lg shadow-lg overflow-hidden animate-fadeIn">
    <thead className="bg-blue-500 text-white">
      <tr>
        <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide">Meal Type</th>
        <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide">Meal</th>
        <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide">Calories</th>
        <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide">Protein (g)</th>
        <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide">Carbs (g)</th>
        <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide">Fats (g)</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {["breakfast", "lunch", "dinner"].map((mealType, idx) => (
        <tr
          key={mealType}
          className={`transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 ${
            idx % 2 === 0 ? "bg-gray-50" : "bg-white"
          }`}
        >
          <td className="px-4 py-3 text-sm font-medium text-gray-700">
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700 space-y-1">
            {filteredData.meals[mealType].map((meal, index) => (
              <div key={index} className="animate-slideInUp">
                {meal.name} - {meal.quantity}
              </div>
            ))}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">
            {filteredData.meals[mealType].reduce((acc, meal) => acc + meal.calories, 0)}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">
            {filteredData.meals[mealType].reduce((acc, meal) => acc + meal.protein, 0)}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">
            {filteredData.meals[mealType].reduce((acc, meal) => acc + meal.carbs, 0)}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">
            {filteredData.meals[mealType].reduce((acc, meal) => acc + meal.fats, 0)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

    </div>
  );
};

export default NutritionForm;
