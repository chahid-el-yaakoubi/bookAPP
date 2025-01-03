import HouseRental from '../models/HouseRental.js';
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


export const creatHouse = async (req, res, next) => {
    console.log('Received request body:', req.body);
    const newHouse = new HouseRental(req.body);
    try {
        console.log('Creating new house:', newHouse);
        const saveHouse = await newHouse.save();
        console.log('House saved successfully:', saveHouse);
        res.status(200).json(saveHouse);
    } catch (err) {
        console.error('Error creating house:', err);
        next(err);
    }
}


export const updateHouse = async (req, res, next) => {

    try {
        const updateHouse = await HouseRental.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateHouse);
    } catch (err) {
        next(err);
    }
}



export const deleteHouse = async (req, res, next) => {
    try {
        await HouseRental.findByIdAndDelete(req.params.id);
        res.status(200).json("house has been deleted.");
    } catch (err) {
        next(err);
    }
}


export const getHouse = async (req, res, next) => {
    try {
        const house = await HouseRental.findById(req.params.id);
        res.status(200).json(house);
    } catch (err) {
        next(err);
    }
}



export const getHouses = async (req, res, next) => {
    const { min, max, limit, ...other } = req.query;
    const city = other.city;
    const condition = city ? { "city": city } : {};
    try {
        const houses = await HouseRental.find(condition);
        res.status(200).json(houses);
    } catch (err) {
        next(err);
    }
}

export const countByCity = async (req, res, next) => {
    try {
    const houseCount = await HouseRental.countDocuments({});
        res.status(200).json(houseCount);
    } catch (err) {
        next(err);
    }
}


export const countByType = async (req, res, next) => {

    try {
        const houseCount = await HouseRental.countDocuments({ type: "House" });
        const villaCount = await HouseRental.countDocuments({ type: "Villa" });
        const apartementCount = await HouseRental.countDocuments({ type: "Apartement" });
        const restortCount = await HouseRental.countDocuments({ type: "Restort" });
        const cabinCount = await HouseRental.countDocuments({ type: "Cabin" });
        res.status(200).json([
            { type: "house", count: houseCount },
            { type: "villa", count: villaCount },
            { type: "apartement", count: apartementCount },
            { type: "restort", count: restortCount },
            { type: "cabin", count: cabinCount }
        ]);
    } catch (err) {
        next(err);
    }
}



export const removeImgs = async (req, res, next) => {
    try {
        const houseId = req.params.houseId;
        const { images } = req.body;

        if (!images || !images.length) {
            return res.status(400).json({
                success: false,
                message: "No images provided for deletion"
            });
        }

        // Find house first
        const house = await HouseRental.findById(houseId);
        if (!house) {
            return res.status(404).json({
                success: false,
                message: "House not found"
            });
        }

        // Delete images from Cloudinary
        const deletePromises = images.map(imgUrl => {
            // Extract public ID from the full URL
            const publicId = imgUrl.split('/').pop().split('.')[0];
            return cloudinary.uploader.destroy(publicId);  // Removed 'houses/' prefix
        });

        await Promise.all(deletePromises);

        // Remove images from house's photos array
        const updatedHouse = await HouseRental.findByIdAndUpdate(
            houseId,
            { $pull: { photos: { $in: images } } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            house: updatedHouse
        });
    } catch (err) {
        console.error('Remove images error:', err);
        next(err);
    }
}


export const uploadImgs = async (req, res, next) => {
    try {
        const houseId = req.params.houseId;
        
        // Debug log
        console.log('Files:', req.files);  // Check if files are being received
        console.log('House ID:', houseId); // Check the house ID being received

        // Validate if files exist
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded"
            });
        }

        // Find house first
        const house = await House.findById(houseId);
        if (!house) {
            return res.status(404).json({
                success: false,
                message: "House not found"
            });
        }

        // Upload new images to Cloudinary
        const uploadPromises = req.files.map(file =>
            cloudinary.v2.uploader.upload(file.path, {
                folder: "houses"
            })
        );

        const results = await Promise.all(uploadPromises);
        const imageUrls = results.map(result => result.secure_url);

        // Add new images to house's photos array
        const updatedHouse = await HouseRental.findByIdAndUpdate(
            houseId,
            { $push: { photos: { $each: imageUrls } } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            house: updatedHouse
        });
    } catch (err) {
        console.error('Upload error:', err); // Debug log
        next(err);
    }
}





