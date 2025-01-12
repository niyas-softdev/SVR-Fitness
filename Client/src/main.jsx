import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./component/Redux/cart/store.jsx";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <StrictMode>
    <GoogleOAuthProvider clientId="333862698725-igjpiipjvkk8peckrbggpijtk650t2r4.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
  </Provider>
);
