import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  FETCH_CART_ITEM,
  CART_COUNT,
} from "../cart/cartTypes";

const initialState = {
  products: [],
  loading: false,
  error: null,
  items: [],
  cartCount: 0,
  subtotal: 0,
  totalCartQuantity: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        items: [...state.items, action.payload],
        cartCount: state.cartCount + 1,
        totalCartQuantity:
          state.totalCartQuantity + (action.payload.quantity || 1),
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        items: action.payload.items,
        cartCount: action.payload.cartCount,
        subtotal: action.payload.subtotal,
        totalCartQuantity: action.payload.totalCartQuantity,
      };
    case UPDATE_QUANTITY:
      return {
        ...state,
        items: action.payload.items,
        cartCount: action.payload.cartCount,
        subtotal: action.payload.subtotal,
        totalCartQuantity: action.payload.totalCartQuantity,
      };
    case FETCH_CART_ITEM:
      return {
        ...state,
        items: action.payload.items,
        cartCount: action.payload.cartCount,
        subtotal: action.payload.subtotal,
        totalCartQuantity: action.payload.totalCartQuantity,
      };
    case CART_COUNT:
      return {
        ...state,
        cartCount: action.payload.cartCount,
      };
    default:
      return state;
  }
};

export default cartReducer;
