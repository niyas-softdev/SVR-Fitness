import React, { useState } from "react";
import { workoutPlans } from "../datas/workoutDatas";
import AppNavbar from "../common/AppNavbar";
import BMICalculator from "../pages/bmiCalculator";
import StatsSection from "../section/statsSection";
import { motion } from "framer-motion"; // Import Framer Motion for animations


const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const WorkoutPlan = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);

  const handleFilter = () => {
    const genderPlans = workoutPlans[selectedCategory];
    if (genderPlans && genderPlans[selectedGoal] && genderPlans[selectedGoal][selectedLevel]) {
      setFilteredWorkouts(genderPlans[selectedGoal][selectedLevel]);
    } else {
      setFilteredWorkouts([]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AppNavbar />

     {/* Hero Section */}
{/* Hero Section */}
<motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative isolate overflow-hidden pt-14"
      >
        <img
          src="https://optimumfitnesstraining.com/wp-content/uploads/2023/02/Ann-Arbor-Gym-Optimum-Fitness-Training-In-Ann-Arbor-Michigan.jpg"
          alt="Fitness workout"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 -z-10" />

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Achieve Your Fitness Goals with Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
          Personalized workout plans, expert nutrition advice, and personal training to guide you every step of the way.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition"
            >
              Get Membership
            </a>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-white hover:underline"
            >
              Explore Programs <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </motion.div>


     {/* Personal Training Section */}
<section className="py-20 bg-black">
  <h2 className="text-4xl font-bold text-center mb-12 text-white">
    Personal Training Services
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
    {/* 1-on-1 Training Card */}
    <div className="group relative overflow-hidden rounded-xl bg-black/30 backdrop-blur-lg shadow-lg border border-white/10 transition transform hover:scale-105">
      <div className="p-8">
        <h3 className="text-3xl font-semibold text-white mb-4">
          1-on-1 Training
        </h3>
        <p className="text-gray-300">
          Get personalized coaching to meet your fitness goals with expert trainers.
        </p>
      </div>
    </div>

    {/* Group Classes Card */}
    <div className="group relative overflow-hidden rounded-xl bg-black/30 backdrop-blur-lg shadow-lg border border-white/10 transition transform hover:scale-105">
      <div className="p-8">
        <h3 className="text-3xl font-semibold text-white mb-4">
          Group Classes
        </h3>
        <p className="text-gray-300">
          Join fun and challenging group workouts designed for all fitness levels.
        </p>
      </div>
    </div>

    {/* Online Coaching Card */}
    <div className="group relative overflow-hidden rounded-xl bg-black/30 backdrop-blur-lg shadow-lg border border-white/10 transition transform hover:scale-105">
      <div className="p-8">
        <h3 className="text-3xl font-semibold text-white mb-4">
          Online Coaching
        </h3>
        <p className="text-gray-300">
          Train from anywhere with our expert-led online workout plans.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Workout Plan Filter Section */}
      <section className="container mx-auto p-8">
        <h2 className="text-4xl font-bold text-center mb-8">Choose Your Workout Plan</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <select
            className="w-full max-w-xs p-3 bg-black/30 rounded-lg text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
          <select
            className="w-full max-w-xs p-3 bg-black/30 rounded-lg text-white"
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
          >
            <option value="">Select Goal</option>
            <option value="build_muscle">Build Muscle</option>
            <option value="lose_fat">Lose Fat</option>
          </select>
          <select
            className="w-full max-w-xs p-3 bg-black/30 rounded-lg text-white"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button
            className="p-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
            onClick={handleFilter}
          >
            Get Plan
          </button>
        </div>

        <div className="space-y-10">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((plan, index) => (
              <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">
                  Workout Plan for {plan.day}
                </h3>
                {plan.exercises.map((exercise, idx) => (
                  <div
                    key={idx}
                    className="mb-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    <h4 className="text-xl font-medium mb-2">{exercise.name}</h4>
                    <p>Sets: {exercise.sets}, Reps: {exercise.reps}, Rest: {exercise.rest}</p>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">
              No plans available. Please select different options.
            </p>
          )}
        </div>
      </section>

      {/* BMI Calculator Section */}
      <section className="py-20 bg-black/50">
        <div className="flex justify-center">
          <BMICalculator />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Call-to-Action Section */}
      <section className="py-10 bg-black text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform?</h2>
        <p className="text-xl text-gray-100 mb-6">
          Join our personal training program today!
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:bg-white hover:text-black transition">
          Sign Up Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Social Icons */}
          <div className="flex justify-center space-x-8 mb-8">
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Instagram</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fillRule="evenodd"
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.055 2.007.24 2.49.41a4.902 4.902 0 0 1 1.772 1.153 4.902 4.902 0 0 1 1.153 1.772c.17.483.355 1.32.41 2.49.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.055 1.17-.24 2.007-.41 2.49a4.902 4.902 0 0 1-1.153 1.772 4.902 4.902 0 0 1-1.772 1.153c-.483.17-1.32.355-2.49.41-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.055-2.007-.24-2.49-.41a4.902 4.902 0 0 1-1.772-1.153 4.902 4.902 0 0 1-1.153-1.772c-.17-.483-.355-1.32-.41-2.49-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.055-1.17.24-2.007.41-2.49a4.902 4.902 0 0 1 1.153-1.772 4.902 4.902 0 0 1 1.772-1.153c.483-.17 1.32-.355 2.49-.41 1.266-.058 1.646-.07 4.85-.07zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.323a4.161 4.161 0 1 1 0-8.323 4.161 4.161 0 0 1 0 8.323zm6.406-11.845a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">X</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">GitHub</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">YouTube</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fillRule="evenodd"
                  d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              About Us
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Programs
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Membership
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Contact
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Blog
            </a>
          </div>

          {/* Copyright Text */}
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Fitness Gym. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WorkoutPlan;
