import axios from "axios";
import {
  FETCH_CART_ITEM,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  CART_COUNT
} from "../cart/cartTypes";



export const fetchCartItem = (userId) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/api/cart/${userId}`
    );

    if (response.data && response.data.items) {
      // Dispatch the action to update cart items and count
      dispatch({
        type: FETCH_CART_ITEM,
        payload: {
          items: response.data.items,
          count: response.data.items.length,
        },
      });

      // Optionally update the cart count separately
      dispatch({
        type: CART_COUNT,
        payload: response.data.items.length,
      });

      return response.data; // Return the data for further processing in the component
    } else {
      console.warn("Unexpected response structure:", response.data);
      throw new Error("Invalid response from server.");
    }
  } catch (error) {
    dispatch({
      type: "FETCH_CART_FAILURE",
      payload: error.response?.data || error.message,
    });
    console.error(
      "Error fetching cart items:",
      error.response?.data || error.message
    );
    throw error;
  }
};


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

    if (response.data && response.data.cartCount !== undefined) {
      dispatch({ type: "REMOVE_FROM_CART", payload: productId });
      dispatch({ type: "CART_COUNT", payload: response.data.cartCount });
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Error removing item from cart:", error.response || error);
  }
};



// Update item quantity in cart
export const updateCartItemQuantity = (userId, productId, quantity) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/api/cart/update`,
      { userId, productId, quantity }
    );

    if (response.data && response.data.cart) {
      // Update the Redux store with the backend response
      dispatch({ type: "UPDATE_QUANTITY", payload: response.data.cart.items });
    } else {
      console.warn("Unexpected response structure:", response.data);
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error; // Propagate error to the component
  }
};

