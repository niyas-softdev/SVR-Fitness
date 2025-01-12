import { combineReducers, applyMiddleware, legacy_createStore as createStore } from "redux";
import {thunk} from "redux-thunk"; // Correctly import redux-thunk
import cartReducer from "../../Redux/cart/cartReducers";

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
});

// Create the Redux store with middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
