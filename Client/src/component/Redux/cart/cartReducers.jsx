import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  UPDATE_QUANTITY_OPTIMISTIC,
  REVERT_QUANTITY,
  CART_COUNT
} from "../cart/cartTypes";

const initialState = {
  items: [],
  cartCount: 0,
  subtotal: 0
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        items: [...state.items, action.payload], // Use 'items' consistently
        cartCount: state.cartCount + (action.payload.quantity || 0)
      };
    case "REMOVE_FROM_CART": {
      const updatedItems = state.items.filter(
        (item) => item.productId !== action.payload
      );

      // Recalculate cartCount and subtotal
      const updatedCartCount = updatedItems.reduce(
        (count, item) => count + (item.quantity || 0),
        0
      );

      const updatedSubtotal = updatedItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      );

      console.log("REMOVE_FROM_CART called, updatedItems:", updatedItems);
      console.log("Updated cartCount:", updatedCartCount);
      console.log("Updated subtotal:", updatedSubtotal);

      return {
        ...state,
        items: updatedItems,
        cartCount: updatedCartCount,
        subtotal: updatedSubtotal
      };
    }
    case UPDATE_QUANTITY:
      // case UPDATE_QUANTITY_OPTIMISTIC:
      return {
        ...state,
        items: action.payload,
        subtotal: action.payload.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
          0
        )
      };

    case "FETCH_CART_ITEM":
      return {
        ...state,
        items: action.payload.items,
        cartCount: action.payload.count,
        subtotal: action.payload.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      };

    case "CART_COUNT": {
      // Ensure cartCount is valid
      if (action.payload === null || action.payload === undefined) {
        console.warn("Invalid cartCount payload:", action.payload);
        return state; // Don't overwrite state with invalid data
      }
      return {
        ...state,
        cartCount: action.payload
      };
    }
    default:
      return state;
  }
};

export default cartReducer;
