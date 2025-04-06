import React from "react";
import { BrowserRouter } from "react-router-dom";
import RoleBasedRouter from "./component/routes/RoleBasedRouter";

const App = () => {
  return (
    <BrowserRouter>
      <RoleBasedRouter /> {/* This handles all routes inside */}
    </BrowserRouter>
  );
};

export default App;
