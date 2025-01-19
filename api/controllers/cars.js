import CarRental from '../models/cars.js'; // Update the model to CarRental
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// UPLOAD IMAGES
export const createCar = async (req, res, next) => {
    console.log('Received request body:', req.body);
    const newCar = new CarRental(req.body); // Create a new CarRental instance
    try {
        console.log('Creating new car:', newCar);
        const savedCar = await newCar.save(); // Save the new car
        console.log('Car saved successfully:', savedCar);
        res.status(200).json(savedCar);
    } catch (err) {
        console.error('Error creating car:', err);
        next(err);
    }
}

export const updateCar = async (req, res, next) => {
    try {
        const updatedCar = await CarRental.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedCar);
    } catch (err) {
        next(err);
    }
}

export const deleteCar = async (req, res, next) => {
    try {
        await CarRental.findByIdAndDelete(req.params.id);
        res.status(200).json("Car has been deleted.");
    } catch (err) {
        next(err);
    }
}

export const getCar = async (req, res, next) => {
    try {
        const car = await CarRental.findById(req.params.id);
        res.status(200).json(car);
    } catch (err) {
        next(err);
    }
}

export const getAdminCars = async (req, res, next) => {
    try {
        const cars = await CarRental.find({ isA: req.params.id });
        res.status(200).json(cars);
    } catch (err) {
        next(err);
    }
}

export const getCars = async (req, res, next) => {
    const { min, max, limit, ...other } = req.query;
    const city = other.city;
    const condition = city ? { "city": city } : {};
    try {
        const cars = await CarRental.find(condition);
        res.status(200).json(cars);
    } catch (err) {
        next(err);
    }
}

export const countByCity = async (req, res, next) => {
    const {id} = req.params;
    const condition = id === "all" ? {} : {isA: id};
    try {
        const carCount = await CarRental.countDocuments(condition);
        res.status(200).json(carCount);
    } catch (err) {
        next(err);
    }
}

export const countByType = async (req, res, next) => {
    try {
        const sedanCount = await CarRental.countDocuments({ type: "Sedan" });
        const suvCount = await CarRental.countDocuments({ type: "SUV" });
        const truckCount = await CarRental.countDocuments({ type: "Truck" });
        const coupeCount = await CarRental.countDocuments({ type: "Coupe" });
        const convertibleCount = await CarRental.countDocuments({ type: "Convertible" });
        res.status(200).json([
            { type: "sedan", count: sedanCount },
            { type: "suv", count: suvCount },
            { type: "truck", count: truckCount },
            { type: "coupe", count: coupeCount },
            { type: "convertible", count: convertibleCount }
        ]);
    } catch (err) {
        next(err);
    }
}

export const removeImgs = async (req, res, next) => {
    try {
        const carId = req.params.carId; // Use carId instead of houseId
        const { images } = req.body; // Array of image URLs to be removed
        if (!images || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No images provided for deletion"
            });
        }
        // Find car first
        const car = await CarRental.findById(carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Car not found"
            });
        }
        // Delete images from Cloudinary
        const deletePromises = images.map(imgUrl => {
            const publicId = imgUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract public ID
            return cloudinary.v2.uploader.destroy(publicId);
        });
        const deleteResults = await Promise.all(deletePromises);
        console.log('Cloudinary delete responses:', deleteResults);
        // Remove images from car's photos array
        const updatedCar = await CarRental.findByIdAndUpdate(
            carId,
            { $pull: { photos: { $in: images } } }, // Remove matching images
            { new: true } // Return updated document
        );
        res.status(200).json({
            success: true,
            message: "Images successfully removed",
            car: updatedCar
        });
    } catch (err) {
        console.error('Remove images error:', err);
        next(err);
    }
};

export const uploadImgs = async (req, res, next) => {
    try {
        const carId = req.params.carId; // Extract car ID from the URL params
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded"
            });
        }
        // Find the car first
        const car = await CarRental.findById(carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Car not found"
            });
        }
        // Ensure photos field exists
        if (!car.photos) {
            car.photos = []; // Initialize an empty array for photos if not present
        }
        // Upload new images to Cloudinary
        const uploadPromises = req.files.map(file =>
            cloudinary.v2.uploader.upload(file.path, {
                folder: "cars" // Use the correct folder for car images
            })
        );
        const results = await Promise.all(uploadPromises);
        const imageUrls = results.map(result => result.secure_url); // Get the image URLs
        // Add new images to car's photos array
        const updatedCar = await CarRental.findByIdAndUpdate(
            carId,
            { $push: { photos: { $each: imageUrls } } }, // Push the image URLs to the photos array
            { new: true } // Return the updated car document
        );
        res.status(200).json({
            success: true,
            car: updatedCar
        });
    } catch (err) {
        console.error('Upload error:', err);
        next(err);
    }
}