import { useEffect, useState } from "react";
import axios from "axios";

const NutritionList = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5174/api/nutrition/get"
        );
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans", error);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Nutrition Plans</h2>
      <ul>
        {plans.map((plan) => (
          <li key={plan._id} className="mb-4 p-4 bg-gray-100 rounded shadow">
            <p>Height: {plan.height} cm</p>
            <p>Weight: {plan.weight} kg</p>
            <p>Age: {plan.age}</p>
            <p>Activity Level: {plan.activityLevel}</p>
            <p>Diet Plan: {plan.dietPlan}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NutritionList;
