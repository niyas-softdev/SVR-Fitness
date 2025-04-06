import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const MembershipPlans = () => {
  const userId = localStorage.getItem("userId");

  const frequencies = [
    { value: "monthly", label: "Monthly", priceSuffix: "/mo" },
    { value: "yearly", label: "Yearly", priceSuffix: "/yr" },
  ];

  const [frequency, setFrequency] = useState(frequencies[0]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 1,
      name: "Basic",
      description: "Perfect for beginners starting their fitness journey.",
      price: {
        monthly: 499,
        yearly: 4999,
      },
      planDuration: {
        monthly: 1,
        yearly: 12,
      },
      features: ["Access to gym equipment", "Locker facility"],
      mostPopular: false,
    },
    {
      id: 2,
      name: "Pro",
      description: "Ideal for regular gym goers with extra features.",
      price: {
        monthly: 899,
        yearly: 8999,
      },
      planDuration: {
        monthly: 1,
        yearly: 12,
      },
      features: [
        "Everything in Basic",
        "Group classes",
        "Personal trainer sessions (2/mo)"
      ],
      mostPopular: true,
    },
    {
      id: 3,
      name: "Elite",
      description: "For fitness enthusiasts who want it all.",
      price: {
        monthly: 1499,
        yearly: 14999,
      },
      planDuration: {
        monthly: 1,
        yearly: 12,
      },
      features: [
        "Everything in Pro",
        "Unlimited personal trainer sessions",
        "Diet consultation"
      ],
      mostPopular: false,
    },
  ];

  const handleBuy = async () => {
    if (!selectedPlan) return alert("Please select a plan");

    const payload = {
      userId,
      plan: selectedPlan.name,
      amount: selectedPlan.price[frequency.value],
      planDuration: selectedPlan.planDuration[frequency.value],
    };

    try {
      const { data } = await axios.post("http://localhost:5174/api/membership/create-order", payload);
      const { orderId, amount } = data;

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) return alert("Failed to load Razorpay");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: "INR",
        name: "VR Fitness Membership",
        description: `Payment for ${selectedPlan.name} plan`,
        order_id: orderId,
        handler: async function (response) {
          await axios.post("http://localhost:5174/api/payments/confirm", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId,
            plan: selectedPlan.name,
            planDuration: selectedPlan.planDuration[frequency.value],
          });
          alert("Membership activated!");
        },
        prefill: {
          name: "Gym User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Membership failed", err);
      alert("Payment failed");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        <div className="col-span-2 space-y-6">
          <h2 className="text-4xl font-extrabold mb-6">Select Your Membership</h2>
          <div className="flex gap-4 mb-6">
            {frequencies.map((option) => (
              <button
                key={option.value}
                onClick={() => setFrequency(option)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md ${
                  frequency.value === option.value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-indigo-500 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`relative cursor-pointer p-6 border rounded-2xl shadow-lg transition-all duration-300 ${
                selectedPlan?.id === plan.id
                  ? "border-indigo-600 bg-white/5"
                  : "border-gray-800"
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <h3 className="text-2xl font-semibold mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{plan.description}</p>
              <p className="text-4xl font-bold text-indigo-400 mb-2">
                ₹{plan.price[frequency.value]}
                <span className="text-base font-medium text-gray-400">{frequency.priceSuffix}</span>
              </p>
              <ul className="text-sm text-gray-300 mt-2 space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-indigo-500">✔</span> {feature}
                  </li>
                ))}
              </ul>
              {selectedPlan?.id === plan.id && (
                <div className="absolute top-4 right-4 text-xs bg-indigo-600 text-white px-3 py-1 rounded-full">
                  Selected
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.08 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
                className="mt-4 mx-auto block w-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 rounded-md font-bold tracking-wide text-sm shadow-md animate-pulse"
              >
                Join Today
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="col-span-1 p-6 bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl h-fit sticky top-20">
          <h3 className="text-2xl font-bold mb-6">Summary</h3>
          {selectedPlan ? (
            <div>
              <p className="mb-2">Plan: <strong>{selectedPlan.name}</strong></p>
              <p className="mb-2">Duration: <strong>{selectedPlan.planDuration[frequency.value]} month(s)</strong></p>
              <p className="mb-6 text-xl font-bold text-indigo-400">Total: ₹{selectedPlan.price[frequency.value]}</p>
              <button
                onClick={handleBuy}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold shadow-md"
              >
                Buy Now
              </button>
            </div>
          ) : (
            <p className="text-gray-400">Select a plan to proceed.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MembershipPlans;
