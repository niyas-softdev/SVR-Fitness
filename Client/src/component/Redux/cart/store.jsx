// store.jsx
import { combineReducers } from "redux";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import { thunk } from "redux-thunk";

import cartReducer from "../../Redux/cart/cartReducers";

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
});

// Configure persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], // Only cart will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };
