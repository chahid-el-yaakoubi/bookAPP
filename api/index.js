import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import https from "https";
import fs from "fs";
import authoRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import hotelsRouter from "./routes/hotels.js";
import roomsRouter from "./routes/rooms.js";
import citiesRouter from "./routes/cities.js";
import houseRentalRouter from "./routes/houseRental.js";
import shopsRouter from "./routes/shopSaleRent.js";
import carsRouter from "./routes/cars.js";

// Load environment variables
dotenv.config();
const app = express();

// Middlewares
app.use(helmet()); // Add secure HTTP headers
app.use(morgan("common")); // Log HTTP requests
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "https://axistay-admin.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Exit process if DB fails to connect
  }
};

// Define Routes
app.use("/api/auth", authoRouter);
app.use("/api/users", usersRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/cities", citiesRouter);
app.use("/api/house-rentals", houseRentalRouter);
app.use("/api/shops", shopsRouter);
app.use("/api/cars", carsRouter);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  console.error("Error:", err.stack); // Log detailed error for debugging
  res.status(errorStatus).json({
    success: false,
    message: errorMessage,
    status: errorStatus,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack, // Hide stack in production
  });
});

// MongoDB Events
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!");
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

// HTTPS Server Setup (Optional)
if (process.env.USE_HTTPS === "true") {
  try {
    const sslOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      ca: fs.readFileSync(process.env.SSL_CA_PATH), // Optional: Include CA if required
    };

    https.createServer(sslOptions, app).listen(443, () => {
      console.log("HTTPS server running on port 443");
      connectDB();
    });
  } catch (error) {
    console.error("Failed to start HTTPS server:", error.message);
  }
} else {
  // HTTP Fallback
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
    connectDB();
  });
}
