import React from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "../common/AppNavbar"; // Import your Navbar component
import Footer from "../common/footer"; // Import your Footer component

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-black-800 shadow-md">
        <AppNavbar />
      </header>

      {/* Main Content */}
      <main className="flex-1  bg-black-900">
        <Outlet /> {/* This will render the child component dynamically */}
      </main>

      {/* Footer */}
      <footer className="bg-black-800 mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
