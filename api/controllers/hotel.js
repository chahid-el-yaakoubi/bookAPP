import Hotel from '../models/hotel.js';
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


export const creatHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body);
    try {
        const saveHotel = await newHotel.save();
        res.status(200).json(saveHotel);
    } catch (err) {
        next(err);
    }
}


export const updateHotel = async (req, res, next) => {

    try {
        const updateHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateHotel);
    } catch (err) {
        next(err);
    }
}



export const deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("hotel has been deleted.");
    } catch (err) {
        next(err);
    }
}


export const getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel);
    } catch (err) {
        next(err);
    }
}



export const getHotels = async (req, res, next) => {
    const { min, max, limit, ...other } = req.query;
    const city = other.city;
    const condition = city ? { "city": city } : {};
    try {
        const hotels = await Hotel.find(condition);
        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
}

export const countByCity = async (req, res, next) => {
    try {
    const hotelCount = await Hotel.countDocuments({});
        res.status(200).json(hotelCount);
    } catch (err) {
        next(err);
    }
}


export const countByType = async (req, res, next) => {

    try {
        const hotelCount = await Hotel.countDocuments({ type: "Hotel" });
        const villaCount = await Hotel.countDocuments({ type: "Villa" });
        const apartementCount = await Hotel.countDocuments({ type: "Apartement" });
        const restortCount = await Hotel.countDocuments({ type: "Restort" });
        const cabinCount = await Hotel.countDocuments({ type: "Cabin" });
        res.status(200).json([
            { type: "hotel", count: hotelCount },
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
        const hotelId = req.params.hotelId;
        const { images } = req.body;

        if (!images || !images.length) {
            return res.status(400).json({
                success: false,
                message: "No images provided for deletion"
            });
        }

        // Find hotel first
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        // Delete images from Cloudinary
        const deletePromises = images.map(imgUrl => {
            // Extract public ID from the full URL
            const publicId = imgUrl.split('/').pop().split('.')[0];
            return cloudinary.uploader.destroy(publicId);  // Removed 'houses/' prefix
        });

        await Promise.all(deletePromises);

        // Remove images from hotel's photos array
        const updatedHotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { $pull: { photos: { $in: images } } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            hotel: updatedHotel
        });
    } catch (err) {
        console.error('Remove images error:', err);
        next(err);
    }
}


export const uploadImgs = async (req, res, next) => {
    try {
        const hotelId = req.params.hotelId;
        
        // Debug log
        console.log('Files:', req.files);  // Check if files are being received
        console.log('Hotel ID:', hotelId); // Check the hotel ID being received

        // Validate if files exist
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded"
            });
        }

        // Find hotel first
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
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

        // Add new images to hotel's photos array
        const updatedHotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { $push: { photos: { $each: imageUrls } } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            hotel: updatedHotel
        });
    } catch (err) {
        console.error('Upload error:', err); // Debug log
        next(err);
    }
}





