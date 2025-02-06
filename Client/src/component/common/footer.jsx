import React from "react";

const Footer = () => {
  return (
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
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-sm text-gray-400 hover:text-white">About Us</a>
          <a href="#" className="text-sm text-gray-400 hover:text-white">Programs</a>
          <a href="#" className="text-sm text-gray-400 hover:text-white">Membership</a>
          <a href="#" className="text-sm text-gray-400 hover:text-white">Contact</a>
          <a href="#" className="text-sm text-gray-400 hover:text-white">Blog</a>
        </div>

        {/* Copyright Text */}
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Fitness Gym. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
