import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
  fetchCartItem
} from "../Redux/cart/cartAction";

const CartPage = () => {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  const cartData = useSelector((state) => state.cart);
  const { items: cartItems = [], subtotal = 0 } = cartData; // Check key names

  useEffect(() => {
    console.log("Cart data updated:", cartData);
    console.log("Cart items:", cartData.items);
    console.log("Subtotal:", cartData.subtotal);
    console.log("Cart count:", cartData.cartCount);
  }, [cartData]);

  // Fetch cart items on mount
  useEffect(() => {
    if (!userId) {
      console.warn("User ID not found. Please log in.");
      return;
    }

    dispatch(fetchCartItem(userId));
  }, [userId, dispatch]);

  const handleRemoveFromCart = async (productId) => {
    const updatedItems = cartItems.filter(
      (item) => item.productId !== productId
    );

    // Optimistically update the UI
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: productId
    });

    try {
      const response = await dispatch(removeFromCart(userId, productId));

      // Check the response validity
      if (!response || !response.cartCount) {
        throw new Error("Invalid server response");
      }

      console.log("Item removed successfully:", response.cartCount);
      dispatch({ type: "CART_COUNT", payload: response.cartCount }); // Update cart count if needed
    } catch (error) {
      console.error("Error removing item:", error);

      // Revert state on failure
      dispatch({
        type: "UPDATE_QUANTITY_OPTIMISTIC",
        payload: [...cartItems]
      });
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) {
      alert("Quantity cannot be less than 1.");
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );

    dispatch({
      type: "UPDATE_QUANTITY_OPTIMISTIC",
      payload: updatedItems
    });

    try {
      const response = await dispatch(
        updateCartItemQuantity(userId, productId, quantity)
      );
      if (response?.data?.cart) {
        // Use the server's response to update state
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: response.data.cart.items
        });
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
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
              {cartItems.map((item, index) => (
                <li
                  key={item.id || item.productId || index} // Ensure unique key
                  className="flex py-4"
                >
                  <img
                    src={item.images?.[0] || "/placeholder-image.png"}
                    alt={item.name || "Unknown Product"}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex-1 px-4">
                    <h3 className="font-bold">{item.name || "Unnamed Item"}</h3>
                    <p>
                      $
                      {
                        item.price
                          ? item.price.toFixed(2)
                          : "0.00" /* Default price */
                      }
                    </p>
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
                    <span className="px-4">{item.quantity || 0}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
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
                Subtotal: $
                {subtotal && !isNaN(subtotal) ? subtotal.toFixed(2) : "0.00"}
              </h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
