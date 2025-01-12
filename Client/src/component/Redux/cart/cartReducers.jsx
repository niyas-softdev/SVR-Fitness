import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  CART_COUNT
} from "../cart/cartTypes";

const initialState = {
  cartItems: [],
  cartCount: 0 // New property for the total count of items in the cart
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
        cartCount: state.cartCount + action.payload.quantity // Increment cart count
      };
    case REMOVE_FROM_CART: {
      const removedItem = state.cartItems.find(
        (item) => item.productId === action.payload
      );
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.productId !== action.payload
        ),
        cartCount: state.cartCount - (removedItem?.cartQuantity || 0) // Decrement cart count
      };
    }
    case UPDATE_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        cartCount: state.cartItems.reduce(
          (total, item) =>
            total +
            (item.id === action.payload.id
              ? action.payload.quantity
              : item.quantity),
          0
        ) // Recalculate cart count
      };
    case CART_COUNT:
      return {
        ...state,
        cartCount: action.payload // Directly update the cart count
      };
    default:
      return state;
  }
};

export default cartReducer;
