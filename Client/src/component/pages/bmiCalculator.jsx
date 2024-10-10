import React, { useState } from "react";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) {
      setMessage("Please enter both height and weight.");
      setBmi(null);
      return;
    }

    const heightInMeters = height / 100;
    const calculatedBMI = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(calculatedBMI);
    setMessage(getBMICategory(calculatedBMI));
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Normal weight";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    return "Obese";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          BMI Calculator
        </h2>

        {/* Height Input */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="height"
          >
            Height (cm)
          </label>
          <input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter height in centimeters"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Weight Input */}
        <div className="mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="weight"
          >
            Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in kilograms"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateBMI}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
        >
          Calculate BMI
        </button>

        {/* BMI Result */}
        {bmi && (
          <div className="mt-6 text-center bg-blue-50 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-blue-600">Your BMI: {bmi}</h3>
            <p className="text-xl font-semibold text-gray-800">{message}</p>
          </div>
        )}

        {/* Error Message */}
        {message && !bmi && (
          <div className="mt-6 text-center bg-red-50 p-4 rounded-lg">
            <p className="text-lg font-semibold text-red-600">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMICalculator;
