import axios from "axios";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  CART_COUNT
} from "../cart/cartTypes";

// Fetch cart count and dispatch CART_COUNT
export const fetchCartCount = (userId) => async (dispatch) => {
  console.log("Initiating fetchCartCount action with userId:", userId);

  if (!userId) {
    console.error("fetchCartCount called without a valid userId");
    return;
  }

  try {
    console.log("Sending API request to fetch cart count for userId:", userId);

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/api/cart/cartCount/${userId}`
    );

    console.log("API response received:", response);

    if (response.status === 200) {
      console.log("Cart count fetched successfully:", response.data.cartCount);

      dispatch({ type: CART_COUNT, payload: response.data.cartCount });

      console.log(
        "Dispatched CART_COUNT action with payload:",
        response.data.cartCount
      );
    } else {
      console.warn(
        "Unexpected response while fetching cart count:",
        response.status,
        response.data
      );
    }
  } catch (error) {
    console.error(
      "Error occurred while fetching cart count:",
      error.response?.data || error.message
    );
  }
};

// Add item to cart
export const addToCart = (userId, product) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/api/cart/add`,
      {
        userId,
        productId: product._id,
        quantity: 1
      }
    );

    if (response.data && response.data.cart) {
      dispatch({ type: ADD_TO_CART, payload: response.data.cart });
      dispatch({ type: CART_COUNT, payload: response.data.cart.length });
    }
  } catch (error) {
    console.error(
      "Error adding to cart:",
      error.response?.data || error.message || error
    );
  }
};

export const removeFromCart = (userId, productId) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/api/cart/remove`,
      { userId, productId }
    );

    if (response.data) {
      dispatch({ type: REMOVE_FROM_CART, payload: productId });
      dispatch({ type: CART_COUNT, payload: response.data.cartCount });
      return true; // Indicate success
    }
    return false; // Indicate failure
  } catch (error) {
    console.error(
      "Error removing item from cart:",
      error.response?.data || error.message || error
    );
    throw error; // Bubble up the error
  }
};

// Update item quantity in cart
export const updateCartItemQuantity =
  (userId, productId, quantity) => async (dispatch) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/cart/update`,
        {
          userId,
          productId,
          quantity
        }
      );

      if (response.data && response.data.cart) {
        console.log("Cart updated successfully:", response.data.cart);

        // Dispatch UPDATE_QUANTITY with updated items
        dispatch({ type: UPDATE_QUANTITY, payload: response.data.cart.items });

        // Update cart count
        dispatch({ type: CART_COUNT, payload: response.data.cart.cartCount });
      } else {
        console.warn("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error(
        "Error updating cart item quantity:",
        error.response?.data || error.message || error
      );
    }
  };
