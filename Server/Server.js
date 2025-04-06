require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("./config/db"); // Assuming your db.js file exports the mongoose connection
const passport = require("passport");

// Routes
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const nutritionRoute = require("./routes/nutritionRoute");
const adminRoute = require("./routes/adminRoute");
const cartRoute = require("./routes/cartRoute");
const profileRoute = require("./routes/profileRoute")
const paymentRoutes = require("./routes/paymentRoutes");
const membershipRoutes = require("./routes/membershipRoutes");




const app = express();

// Parse incoming JSON requests
app.use(bodyParser.json());

// Parse cookies from request headers
app.use(cookieParser());

// Initialize passport (if using authentication strategies with passport)
app.use(passport.initialize());

// CORS Configuration - using environment variable for allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];



app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173","http://localhost:5174"], // Allow all origins temporarily
    methods: "GET,POST,PUT,DELETE",
    credentials: true // Allow cookies to be sent cross-origin
  })
);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/admin", adminRoute);
app.use("/api/nutrition", nutritionRoute);
app.use("/api/cart", cartRoute);
app.use("/api/profile", profileRoute);
app.use("/api/payments", paymentRoutes);
app.use("/api/membership", membershipRoutes);


// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Define port from environment variable or default to 5174
const PORT = process.env.PORT || 5174;

// Wait for MongoDB connection before starting the server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// MongoDB connection error handler
