import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // To decode the token

import Confetti from "react-confetti";
import freeDelivery from "../../assets/free-delivery.svg";
import refund from "../../assets/hand-holding-us-dollar.svg";
import support from "../../assets/live-support.svg";
import heroImage from "../../assets/productImage.jpg";
import { addToCart } from "../Redux/cart/cartAction"; // Fetch updated cart after adding an item
import { fetchCartCount } from "../Redux/cart/cartAction";
const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  
  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/product/get`
        );
        setProducts(
          Array.isArray(response.data.products) ? response.data.products : []
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const getUserIdFromToken = () => {
    try {
      const token = sessionStorage.getItem("userToken"); // Retrieve the encrypted token
      if (!token) throw new Error("No token found");

      const decodedToken = jwtDecode(token); // Decode the token to extract user data
      return decodedToken.userId; // Ensure your token contains `userId`
    } catch (error) {
      console.error("Error decoding token:", error);
      return null; // Return null if decoding fails
    }
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();

    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Please log in to add items to the cart.");
      return;
    }

    try {
      await dispatch(addToCart(userId, product));

      // Trigger confetti effect
      setShowConfetti(true);

      // Show modal
      setModalVisible(true);

      // Automatically close confetti and modal after 4 seconds
      setTimeout(() => {
        setShowConfetti(false);
        setModalVisible(false);
      }, 4000);
    } catch (error) {
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
     

      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <img
          src={heroImage}
          alt="Fitness Hero"
          className="w-full h-[400px] object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">
            Achieve Your Fitness Goals
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl">
            Discover the best fitness supplements and workout plans tailored
            just for you. Let’s take your fitness journey to the next level!
          </p>
          <button className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300">
            Start Shopping
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center border border-gray-700 rounded-lg p-6 bg-gray-800 hover:bg-gray-700 transition duration-300">
            <img
              src={freeDelivery}
              alt="Free Shipping"
              className="h-12 w-12 mr-4 text-indigo-400"
            />
            <div>
              <h3 className="text-lg font-bold text-white">Free Shipping</h3>
              <p className="text-sm text-gray-400">Order over $200</p>
            </div>
          </div>
          <div className="flex items-center border border-gray-700 rounded-lg p-6 bg-gray-800 hover:bg-gray-700 transition duration-300">
            <img
              src={refund}
              alt="Money Returns"
              className="h-12 w-12 mr-4 text-indigo-400"
            />
            <div>
              <h3 className="text-lg font-bold text-white">Money Returns</h3>
              <p className="text-sm text-gray-400">30 days money return</p>
            </div>
          </div>
          <div className="flex items-center border border-gray-700 rounded-lg p-6 bg-gray-800 hover:bg-gray-700 transition duration-300">
            <img
              src={support}
              alt="24/7 Support"
              className="h-12 w-12 mr-4 text-indigo-400"
            />
            <div>
              <h3 className="text-lg font-bold text-white">24/7 Support</h3>
              <p className="text-sm text-gray-400">Customer support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-white mb-12">
          Explore Our Products
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white text-black rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-contain"
                  />
                  <div className="absolute top-0 left-0 bg-black bg-opacity-60 text-white p-2 text-sm uppercase font-bold">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-indigo-400">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
          recycle={false}
          initialVelocityY={10}
          confettiSource={{
            x: 0,
            y: window.scrollY,
            w: window.innerWidth,
            h: 0
          }}
        />
      )}

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Added to Cart!</h2>
            <p className="mb-4">
              Your item has been successfully added to the cart.
            </p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ProductPage;
