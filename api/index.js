import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

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

if (!process.env.MONGO_DB || !process.env.JWT_SECRET) {
    console.error("Environment variables are not properly configured!");
    process.exit(1);
}

// Middleware
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = ['http://localhost:5173', 'https://axistay-admin.onrender.com'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

const PORT = process.env.PORT || 4000;

// Database Connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB); // No options needed
        console.log('MongoDB connected!');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connect, 5000); // Retry after 5 seconds
    }
};

// Routes
app.use('/api/auth', authoRouter);
app.use('/api/users', usersRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/cities', citiesRouter);
app.use('/api/house-rentals', houseRentalRouter);
app.use('/api/shops', shopsRouter);
app.use('/api/cars', carsRouter);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }
    res.status(errorStatus).json({
        success: false,
        message: errorMessage,
        status: errorStatus,
    });
});

// Graceful Shutdown
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});

// Start Server
app.listen(PORT, () => {
    connect();
    console.log(`Server running at http://localhost:${PORT}`);
});
