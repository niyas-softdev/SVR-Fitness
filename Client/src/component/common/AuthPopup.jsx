import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const AuthPopup = () => {
  const navigate = useNavigate(); 
  const [showPopup, setShowPopup] = useState(true); 

  const handleLogin = async () => {
    try {
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

      if (data.ok) {
        toast.success(data.message);

        const userData = {
          id: data.data.userId,
          email: loginFormData.email,
          role: data.data.role, 
          authToken: data.data.authToken,
          refreshToken: data.data.refreshToken
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        if (userData.role === "admin") {
          window.location.href = "/admin"; 
        } else {
          window.location.href = "/user"; 
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/googleLogin`,
        { token: tokenResponse.access_token }
      );
      sessionStorage.setItem("userToken", response.data.token);
      navigate("/");
    },
    onError: (errorResponse) => console.log(errorResponse)
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
            onClick={() => handleGoogleLogin()}
            className="flex mt-6 w-full items-center justify-center gap-3 rounded-md bg-gray-700 bg-opacity-50 px-3 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600 cursor-pointer transition-colors"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            <span className="text-sm font-semibold leading-6">Log in with Google</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
