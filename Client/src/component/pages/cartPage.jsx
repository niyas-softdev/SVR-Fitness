import React, { useEffect, useState } from "react";
import axios from "axios";
import { removeFromCart } from "../Redux/cart/cartAction";
import { jwtDecode } from "jwt-decode"; // To decode the token
import { useDispatch } from "react-redux";

const CartPage = () => {
  const userId = localStorage.getItem("userId"); // Assuming the userId is stored here
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const dispatch = useDispatch();

  // Fetch cart data directly
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userId) {
          console.warn("User ID not found. Please log in.");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/cart/${userId}`
        );
        const items = response.data.items;

        setCartItems(items);

        // Calculate subtotal
        const total = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setSubtotal(total);
      } catch (error) {
        console.error(
          "Error fetching cart:",
          error.response?.data || error.message
        );
      }
    };

    fetchCart();
  }, [userId]);

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

  const handleRemoveFromCart = async (e, productId) => {
    e.preventDefault();

    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Please log in to remove items from the cart.");
      return;
    }

    // Optimistically update the UI
    const updatedCart = cartItems.filter(
      (item) => item.productId !== productId
    );
    setCartItems(updatedCart);

    try {
      const response = await dispatch(removeFromCart(userId, productId));

      if (response) {
        alert("Item removed from cart successfully!");
      } else {
        // If API call fails, revert the UI change
        setCartItems((prevItems) => [
          ...prevItems,
          cartItems.find((item) => item.productId === productId)
        ]);
        alert("Failed to remove item from cart. Please try again.");
      }
    } catch (error) {
      // Revert UI change in case of error
      setCartItems((prevItems) => [
        ...prevItems,
        cartItems.find((item) => item.productId === productId)
      ]);
      console.error("Error removing item from cart:", error);
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  // Handle quantity change
  const handleQuantityChange = async (productId, quantity) => {
    if (quantity <= 0) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/api/cart/${userId}/${productId}`,
        { quantity }
      );

      // Update the cart locally
      const updatedCart = cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      setCartItems(updatedCart);

      // Recalculate subtotal
      const total = updatedCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setSubtotal(total);
    } catch (error) {
      console.error(
        "Error updating item quantity:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6">Your Cart</h1>
      <div className="max-w-4xl mx-auto p-4">
        {cartItems.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-300">
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-4">
                  <img
                    src={item.images?.[0] || "/placeholder-image.png"}
                    alt={item.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex-1 px-4">
                    <h3 className="font-bold">{item.name}</h3>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                    <button
                      onClick={(e) => handleRemoveFromCart(e, item.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right">
              <h2 className="text-lg font-bold">
                Subtotal: ${subtotal.toFixed(2)}
              </h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
