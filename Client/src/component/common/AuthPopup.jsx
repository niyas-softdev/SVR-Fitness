import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/vr Fitness transparent Gym Logo.png";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const AuthPopup = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);

  // const handleLogin = async () => {
  //   try {
  //     const res = await fetch(
  //       `${import.meta.env.VITE_BACKEND_API}/api/auth/login`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(loginFormData),
  //         credentials: "include",
  //       }
  //     );

  //     const data = await res.json();

  //     if (data.ok) {
  //       toast.success(data.message);

  //       const userData = {
  //         id: data.data.userId,
  //         email: loginFormData.email,
  //         role: data.data.role,
  //         authToken: data.data.authToken,
  //         refreshToken: data.data.refreshToken,
  //       };

  //       localStorage.setItem("userData", JSON.stringify(userData));
  //       localStorage.setItem("userId", userData.id);

  //       if (userData.role === "admin") {
  //         navigate("/admin");
  //       } else {
  //         navigate("/user");
  //       }
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     toast.error("Login failed. Please try again.");
  //   }
  // };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/api/auth/googleLogin`,
          { token: tokenResponse.access_token }
        );

        const token = response.data.token;
        sessionStorage.setItem("userToken", token);

        const decoded = jwtDecode(token);
        localStorage.setItem("userId", decoded.userId);

        navigate("/");
      } catch (error) {
        console.error("Google Login Error:", error);
        toast.error("Google login failed. Please try again.");
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Error:", errorResponse);
      toast.error("Google login failed. Please try again.");
    },
  });

  const handleClose = () => {
    setShowPopup(false);
    navigate("/");
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50 backdrop-blur-sm">
      <ToastContainer />
      <div
        className="relative p-8 rounded-lg shadow-lg w-full max-w-lg overflow-auto max-h-[90vh] bg-gray-800 bg-opacity-40 backdrop-blur-md animate-fadeIn border border-gray-700"
        style={{ animationDuration: "0.3s" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
          onClick={handleClose}
        >
          <AiOutlineClose size={24} />
        </button>

        <div className="text-center">
          <img
            src={logo}
            alt="Logo"
            className="mx-auto rounded-full bg-gray-800 p-2"
            width={100}
            height={100}
          />
          <h1 className="text-2xl font-semibold mt-4 text-gray-100">Log In</h1>
          <span
            onClick={handleGoogleLogin}
            className="flex mt-6 w-full items-center justify-center gap-3 rounded-md bg-gray-700 bg-opacity-50 px-3 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600 cursor-pointer transition-colors"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              {/* SVG paths */}
            </svg>
            <span className="text-sm font-semibold leading-6">Log in with Google</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
