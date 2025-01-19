import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authoRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import hotelsRouter from "./routes/hotels.js";
import roomsRouter from "./routes/rooms.js";
import citiesRouter from "./routes/cities.js";
import houseRentalRouter from "./routes/houseRental.js";
import shopsRouter from "./routes/shopSaleRent.js";
import carsRouter from "./routes/cars.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 18012;

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL, // Replace with your frontend URL, e.g., 'https://yourfrontend.com'
  credentials: true, // Allow sending cookies with requests
};

app.use(cors(corsOptions)); // Use CORS middleware with the defined options
app.use(express.json());
app.use(cookieParser());

// Route setup
app.use('/api/auth', authoRouter);
app.use('/api/users', usersRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/cities', citiesRouter);
app.use('/api/house-rentals', houseRentalRouter);
app.use('/api/shops', shopsRouter);
app.use('/api/cars', carsRouter);

// MongoDB connection setup
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    message: errorMessage,
    status: errorStatus,
    stack: err.stack,
  });
});

// Listen for incoming requests
app.listen(PORT, () => {
  connect();
  console.log(`Server is running at http://localhost:${PORT}`);
});

// MongoDB connection event handlers
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!");
});

mongoose.connection.on("disconnect", () => {
  console.log("MongoDB connection lost!");
});
