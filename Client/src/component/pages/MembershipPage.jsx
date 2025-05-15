import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const MembershipPlans = () => {
  const userId = localStorage.getItem("userId");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [showMobilePopup, setShowMobilePopup] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5174/api/membership/getALLplan")
      .then((response) => {
        if (response.data.success) {
          setPlans(response.data.data);
        } else {
          console.error("Error fetching plans: ", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching plans: ", error);
      });
  }, []);

  const handleBuy = async () => {
    if (!selectedPlan) return alert("Please select a plan");

    const payload = {
      userId,
      membershipPlan: selectedPlan._id,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:5174/api/membership/create-order",
        payload
      );
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
          await axios.post("http://localhost:5174/api/membership/confirmMembershipPayment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId,
            plan: selectedPlan.name,
            planDuration: selectedPlan.planDuration,
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

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <>
      <section className="py-16 px-6 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="col-span-2 space-y-6">
            <h2 className="text-4xl font-extrabold mb-6">Select Your Membership</h2>
            {plans.map((plan) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`relative cursor-pointer p-6 border rounded-2xl shadow-lg transition-all duration-300 ${
                  selectedPlan?._id === plan._id
                    ? "border-indigo-600 bg-white/5"
                    : "border-gray-800"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <h3 className="text-2xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{plan.description}</p>
                <p className="text-4xl font-bold text-indigo-400 mb-2">
                  ₹{plan.price}
                </p>
                <ul className="text-sm text-gray-300 mt-2 space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-indigo-500">✔</span> {feature}
                    </li>
                  ))}
                </ul>
                {selectedPlan?._id === plan._id && (
                  <div className="absolute top-4 right-4 text-xs bg-indigo-600 text-white px-3 py-1 rounded-full">
                    Selected
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 0.8,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isMobile) {
                      setSelectedPlan(plan);
                      setShowMobilePopup(true);
                    } else {
                      setSelectedPlan(plan);
                    }
                  }}
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
                <p className="mb-2">
                  Plan: <strong>{selectedPlan.name}</strong>
                </p>
                <p className="mb-2">
                  Total Duration: <strong>{selectedPlan.planDuration} month(s)</strong>
                </p>
                <p className="mb-6 text-xl font-bold text-indigo-400">
                  Total: ₹{selectedPlan.price}
                </p>
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

      {/* Mobile Popup */}
      {showMobilePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center md:hidden px-4">
          <div className="bg-white text-black rounded-lg shadow-xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setShowMobilePopup(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-2">Confirm Your Plan</h3>
            <p className="text-sm mb-2">Plan: <strong>{selectedPlan?.name}</strong></p>
            <p className="text-sm mb-2">Price: ₹{selectedPlan?.price}</p>
            <p className="text-sm mb-4">Duration: {selectedPlan?.planDuration} month(s)</p>
            <button
              onClick={() => {
                setShowMobilePopup(false);
                handleBuy();
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MembershipPlans;
