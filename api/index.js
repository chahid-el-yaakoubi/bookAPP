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

const PORT = process.env.PORT || 4000;

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
    } catch (err) {
        throw err;
    }
};
app.use(cors({
    origin: 'https://axistay-backend.onrender.com', // replace with your actual domain
  }));
app.use(express.json())
app.use(cookieParser())

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