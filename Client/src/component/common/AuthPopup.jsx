import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import logo from "../../assets/logo.jpg";

const AuthPopup = ({ setShowpopup }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [showSignup, setShowSignup] = useState(false);
  const [signupFormData, setSignupFormData] = useState({
    name: "",
    email: "",
    password: "",
    weightInKg: 0,
    heightInCm: 0,
    goal: "",
    gender: "",
    dob: new Date(),
    activityLevel: "" // Add activity level to form data
  });
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    try {
      console.log("Login Data: ", loginFormData); // Log the login data
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginFormData),
          credentials: "include"
        }
      );

      const data = await res.json();
      console.log("Response from server:", data); // Log the response from the server

      if (data.ok) {
        toast.success(data.message);
        setShowpopup(false); // Close popup on successful login
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error); // Log any error during login
      toast.error("Login failed. Please try again.");
    }
  };

  const handleSignup = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupFormData),
          credentials: "include"
        }
      );
      const data = await res.json();
      if (data.ok) {
        toast.success(data.message);
        setShowSignup(false); // Close signup form after successful registration
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <ToastContainer />
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative overflow-auto max-h-[90vh] animate-fadeIn"
        style={{ animationDuration: "0.3s" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          onClick={() => navigate(-1)} // Use navigate(-1) to go back on close
        >
          <AiOutlineClose size={24} />
        </button>

        {showSignup ? (
          <div>
            <div className="text-center">
              <img
                src={logo}
                alt="Logo"
                className="mx-auto"
                width={100}
                height={100}
              />
              <h1 className="text-2xl font-semibold mt-4">Sign Up</h1>
            </div>
            <form
              className="mt-4 space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="text"
                placeholder="Name"
                value={signupFormData.name}
                onChange={(e) =>
                  setSignupFormData({ ...signupFormData, name: e.target.value })
                }
              />
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="email"
                placeholder="Email"
                value={signupFormData.email}
                onChange={(e) =>
                  setSignupFormData({
                    ...signupFormData,
                    email: e.target.value
                  })
                }
              />
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="password"
                placeholder="Password"
                value={signupFormData.password}
                onChange={(e) =>
                  setSignupFormData({
                    ...signupFormData,
                    password: e.target.value
                  })
                }
              />
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="number"
                placeholder="Weight (kg)"
                value={signupFormData.weightInKg}
                onChange={(e) =>
                  setSignupFormData({
                    ...signupFormData,
                    weightInKg: parseFloat(e.target.value)
                  })
                }
              />
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="number"
                placeholder="Height (cm)"
                value={signupFormData.heightInCm}
                onChange={(e) =>
                  setSignupFormData({
                    ...signupFormData,
                    heightInCm: parseFloat(e.target.value)
                  })
                }
              />
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={signupFormData.gender}
                onChange={(e) =>
                  setSignupFormData({
                    ...signupFormData,
                    gender: e.target.value
                  })
                }
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Date of Birth"
                  value={dayjs(signupFormData.dob)}
                  onChange={(newValue) =>
                    setSignupFormData({
                      ...signupFormData,
                      dob: newValue.toDate()
                    })
                  }
                  renderInput={({ inputRef, inputProps }) => (
                    <input
                      ref={inputRef}
                      {...inputProps}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  )}
                />
              </LocalizationProvider>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={signupFormData.goal}
                onChange={(e) =>
                  setSignupFormData({ ...signupFormData, goal: e.target.value })
                }
              >
                <option value="">Select Goal</option>
                <option value="weightLoss">Lose Weight</option>
                <option value="weightMaintain">Maintain Weight</option>
                <option value="weightGain">Gain Weight</option>
              </select>

              {/* Activity Level Dropdown */}
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={signupFormData.activityLevel}
                onChange={(e) =>
                  setSignupFormData({
                    ...signupFormData,
                    activityLevel: e.target.value
                  })
                }
              >
                <option value="">Select Activity Level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="active">Active</option>
                <option value="veryActive">Very Active</option>
              </select>

              <button
                onClick={handleSignup}
                className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </form>
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => setShowSignup(false)}
              >
                Log In
              </button>
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center">
              <img
                src={logo}
                alt="Logo"
                className="mx-auto"
                width={100}
                height={100}
              />
              <h1 className="text-2xl font-semibold mt-4">Log In</h1>
            </div>
            <form
              className="mt-4 space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="email"
                placeholder="Email"
                value={loginFormData.email}
                onChange={(e) =>
                  setLoginFormData({ ...loginFormData, email: e.target.value })
                }
              />
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="password"
                placeholder="Password"
                value={loginFormData.password}
                onChange={(e) =>
                  setLoginFormData({
                    ...loginFormData,
                    password: e.target.value
                  })
                }
              />
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700 transition-colors"
              >
                Log In
              </button>
            </form>
            <p className="mt-4 text-center">
              Don&apos;t have an account?{" "}
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => setShowSignup(true)}
              >
                Sign Up
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPopup;
