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
    if (response.data && response.data.cart) {
      dispatch({
        type: FETCH_CART_ITEM,
        payload: response.data.cart, // `cart` contains items, subtotal, cartCount, and totalCartQuantity
      });
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response.data);
      throw new Error("Invalid response from server.");
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchCartCount = (userId) => async (dispatch) => {
  try {
    if (!userId) {
      console.error("fetchCartCount called without a valid userId");
      return;
    }
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/api/cart/cartCount/${userId}`
    );
    if (response.status === 200) {
      dispatch({ type: CART_COUNT, payload: response.data });
    } 
  } catch (error) {
    console.error(error);
  }
};

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
    if (response.data) {
      dispatch({ type: ADD_TO_CART, payload: response.data.cart });
      dispatch({ type: CART_COUNT, payload: response.data });
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

    if (response.data && response.data.cart) {
      dispatch({
        type: REMOVE_FROM_CART,
        payload: response.data.cart, // `cart` contains updated items, subtotal, cartCount, and totalCartQuantity
      });
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Error removing item from cart:", error.response || error);
  }
};

export const updateCartItemQuantity = (userId, productId, quantity) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/api/cart/update`,
      { userId, productId, quantity }
    );

    if (response.data && response.data.cart) {
      // Update the Redux store with the backend response
      dispatch({
        type: UPDATE_QUANTITY,
        payload: response.data.cart, // `cart` contains updated items, subtotal, cartCount, and totalCartQuantity
      });
    } else {
      console.warn("Unexpected response structure:", response.data);
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error; // Propagate error to the component
  }
};