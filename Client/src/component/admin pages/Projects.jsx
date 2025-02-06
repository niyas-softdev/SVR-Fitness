import React from "react";
import AppNavbar from "../common/AppNavbar";
import Footer from "../common/Footer";
const AboutUs = () => {
    return (
      <div>
          <AppNavbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          
            <div className="max-w-4xl bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">About Us</h2>
                <p className="text-gray-600 text-lg text-center mb-6">
                    Welcome to our pet shop! We are passionate about providing high-quality pets, food,
                    and accessories to ensure your furry friends are happy and healthy.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-100 p-4 rounded-xl">
                        <h3 className="text-xl font-semibold text-blue-800">Our Mission</h3>
                        <p className="text-gray-700 mt-2">
                            Our goal is to create a loving and caring environment for pets and their owners.
                        </p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-xl">
                        <h3 className="text-xl font-semibold text-green-800">What We Offer</h3>
                        <p className="text-gray-700 mt-2">
                            We provide a wide range of pet products including premium food, toys, and grooming accessories.
                        </p>
                    </div>
                </div>
            </div>
           
        </div>
        <Footer />
        </div>

    );
};

export default AboutUs;