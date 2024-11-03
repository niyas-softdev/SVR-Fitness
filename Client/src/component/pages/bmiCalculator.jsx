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
    <div className=" flex flex-col items-center justify-center bg-black p-6">
  {/* Fitness Heading */}
  <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-white mb-10 text-center">
    Track Your Fitness 
  </h1>

  {/* Glassy BMI Calculator */}
  <div className="w-full max-w-md p-8 bg-black/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
    <h2 className="text-3xl font-bold text-white text-center mb-6">BMI Calculator</h2>

    {/* Height Input */}
    <div className="mb-4">
      <label htmlFor="height" className="block text-white font-semibold mb-2">
        Height (cm)
      </label>
      <input
        id="height"
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        placeholder="Enter height in centimeters"
        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>

    {/* Weight Input */}
    <div className="mb-6">
      <label htmlFor="weight" className="block text-white font-semibold mb-2">
        Weight (kg)
      </label>
      <input
        id="weight"
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Enter weight in kilograms"
        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>

    {/* Calculate Button */}
    <button
      onClick={calculateBMI}
      className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
    >
      Calculate BMI
    </button>

    {/* BMI Result */}
    {bmi && (
      <div className="mt-6 text-center bg-blue-50/20 p-4 rounded-lg">
        <h3 className="text-2xl font-bold text-white">Your BMI: {bmi}</h3>
        <p className="text-xl font-semibold text-white">{message}</p>
      </div>
    )}

    {/* Error Message */}
    {message && !bmi && (
      <div className="mt-6 text-center bg-red-50/20 p-4 rounded-lg">
        <p className="text-lg font-semibold text-red-500">{message}</p>
      </div>
    )}
  </div>
</div>

  );
};

export default BMICalculator;
