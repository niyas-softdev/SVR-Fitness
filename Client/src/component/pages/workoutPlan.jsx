import React, { useState } from "react";
import { workoutPlans } from "../datas/workoutDatas";
import BMICalculator from "./bmiCalculator";
import StatsSection from "../section/statsSection";
import { motion } from "framer-motion";
import axios from "axios";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const WorkoutPlan = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleFilter = () => {
    const genderPlans = workoutPlans[selectedCategory];
    if (
      genderPlans &&
      genderPlans[selectedGoal] &&
      genderPlans[selectedGoal][selectedLevel]
    ) {
      setFilteredWorkouts(genderPlans[selectedGoal][selectedLevel]);
    } else {
      setFilteredWorkouts([]);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) return alert("Please fill in all fields");

    try {
      const res = await axios.post("/api/workout/signup", {
        name,
        email,
        phone,
        selectedCategory,
        selectedGoal,
        selectedLevel,
      });

      if (res.data.success) {
        alert("Plan signup successful!");
        setName("");
        setEmail("");
        setPhone("");
      } else {
        alert("Submission failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
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

        <div className="mx-auto max-w-2xl py-32 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Achieve Your Fitness Goals with Us
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Personalized workout plans, expert nutrition advice, and personal training to guide you every step of the way.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href="#signup" className="rounded-md bg-red-600 px-5 py-3 text-sm font-semibold hover:bg-red-700">
              Get Membership
            </a>
            <a href="#plans" className="text-sm font-semibold hover:underline">
              Explore Programs →
            </a>
          </div>
        </div>
      </motion.div>

      <StatsSection />

      <section className="py-20 bg-black/50">
        <div className="flex justify-center">
          <BMICalculator />
        </div>
      </section>

      <section className="py-20 bg-black">
        <h2 className="text-4xl font-bold text-center mb-12">Personal Training Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
          {[
            { title: "1-on-1 Training", desc: "Get personalized coaching to meet your fitness goals." },
            { title: "Group Classes", desc: "Join fun and challenging group workouts." },
            { title: "Online Coaching", desc: "Train from anywhere with online plans." },
          ].map((service, idx) => (
            <div key={idx} className="group relative rounded-xl bg-black/30 backdrop-blur-lg shadow-lg border border-white/10 hover:scale-105 transition">
              <div className="p-8">
                <h3 className="text-3xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-300">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="plans" className="container mx-auto p-8">
        <h2 className="text-4xl font-bold text-center mb-8">Choose Your Workout Plan</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <select className="w-full max-w-xs p-3 bg-black/30 rounded-lg" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
          <select className="w-full max-w-xs p-3 bg-black/30 rounded-lg" value={selectedGoal} onChange={(e) => setSelectedGoal(e.target.value)}>
            <option value="">Select Goal</option>
            <option value="build_muscle">Build Muscle</option>
            <option value="lose_fat">Lose Fat</option>
          </select>
          <select className="w-full max-w-xs p-3 bg-black/30 rounded-lg" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button onClick={handleFilter} className="p-3 bg-blue-600 hover:bg-blue-500 rounded-lg">
            Get Plan
          </button>
        </div>

        <div className="space-y-10">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((plan, index) => (
              <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Workout Plan for {plan.day}</h3>
                {plan.exercises.map((exercise, idx) => (
                  <div key={idx} className="mb-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600">
                    <h4 className="text-xl font-medium mb-2">{exercise.name}</h4>
                    <p>Sets: {exercise.sets}, Reps: {exercise.reps}, Rest: {exercise.rest}</p>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No plans available. Please select different options.</p>
          )}
        </div>
      </section>

      <section id="signup" className="py-16 px-4 sm:px-10 bg-black text-white">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Get Your Personalized Plan</h2>
          <form onSubmit={handleSignup} className="grid gap-6">
            <input type="text" className="p-3 rounded-lg bg-black/30" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" className="p-3 rounded-lg bg-black/30" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="tel" className="p-3 rounded-lg bg-black/30" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">Submit</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default WorkoutPlan;