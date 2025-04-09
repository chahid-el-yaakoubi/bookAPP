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

app.use(cookieParser());

// Middleware
app.use(express.json()); // Built-in JSON body parser
app.use(express.urlencoded({ extended: true })); // Built-in URL-encoded parser

// CORS Configuration (Keep this one only)
app.use(cors({
    origin: ['http://localhost:5173', 'https://axistay-admin.onrender.com', 'https://axistay-client.onrender.com'], // Allow these origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    credentials: true, // Allow cookies and credentials
}));

const PORT = process.env.PORT || 4000;

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log('MongoDB connected!');
    } catch (err) {
        console.log('MongoDB connection failed:', err);
        throw err;
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

mongoose.connection.on("connected", () => {
    console.log('MongoDB connected!');
});

mongoose.connection.on("disconnect", () => {
    console.log('MongoDB connection lost!');
});

app.listen(PORT, () => {
    connect();
    console.log(`Server running at http://localhost:${PORT}`);
});
