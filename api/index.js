import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
const app = express();
import authoRouter from "./routes/auth.js"
import usersRouter from "./routes/users.js"
import hotelsRouter from "./routes/hotels.js"
import roomsRouter from "./routes/rooms.js"
import citiesRouter from "./routes/cities.js"
import houseRentalRouter from "./routes/houseRental.js"
import shopsRouter from "./routes/shopSaleRent.js"
import carsRouter from "./routes/cars.js"
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
app.use(cookieParser())

// Middleware
app.use(express.json()); // Built-in JSON body parser
app.use(express.urlencoded({ extended: true })); // Built-in URL-encoded parser

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:5173', 'https://axistay-admin.onrender.com'], // Match the frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Allow cookies and credentials
}));

const allowedOrigins = [
    "http://localhost:5173",
    "https://axistay-admin.onrender.com", // Add your other domain here
  ];
  
// Set Headers for CORS
app.use((req, res, next) => {
    const origin = req.get("Origin");
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


const PORT = process.env.PORT || 4000;

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
    } catch (err) {
        throw err;
    }
};



app.use('/api/auth', authoRouter);
app.use('/api/users', usersRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/cities', citiesRouter);
app.use('/api/house-rentals', houseRentalRouter);
app.use('/api/shops', shopsRouter);
app.use('/api/cars', carsRouter);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        message: errorMessage,
        status: errorStatus,
        stack: err.stack,
    })
})


mongoose.connection.on("connected", () => {
    console.log('MongoDB connected!');
})
mongoose.connection.on("disconnect", () => {
    console.log('MongoDB connection lost!');
})
app.listen(PORT, () => {
    connect();
    console.log(`http://localhost:${PORT}`);
})