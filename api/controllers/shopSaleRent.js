import Shop from '../models/shopSaleRent.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// CREATE SHOP
export const createShop = async (req, res, next) => {
    const newShop = new Shop(req.body);
    try {
        const savedShop = await newShop.save();
        res.status(200).json(savedShop);
    } catch (err) {
        next(err);
    }
};

// UPDATE SHOP
export const updateShop = async (req, res, next) => {
    try {
        const updatedShop = await Shop.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedShop);
    } catch (err) {
        next(err);
    }
};

// DELETE SHOP
export const deleteShop = async (req, res, next) => {
    try {
        await Shop.findByIdAndDelete(req.params.id);
        res.status(200).json("Shop has been deleted.");
    } catch (err) {
        next(err);
    }
};

// GET SINGLE SHOP
export const getShop = async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.id);
        res.status(200).json(shop);
    } catch (err) {
        next(err);
    }
};

// GET ALL SHOPS
export const getShops = async (req, res, next) => {
    const { min, max, limit, ...other } = req.query;
    const condition = other.city ? { city: other.city } : {};
    try {
        const shops = await Shop.find(condition).limit(Number(limit));
        res.status(200).json(shops);
    } catch (err) {
        next(err);
    }
};

// GET ALL SHOPS admin
export const getAdminShops = async (req, res, next) => {
   const { id } = req.params;
    try {
        const shops = await Shop.find({ isA: id });
        res.status(200).json(shops);
    } catch (err) {
        next(err);
    }
};

// COUNT SHOPS BY CITY
export const countByCity = async (req, res, next) => {
    const {id} = req.params;
    const condition = id === "all" ? {} : {isA: id};
    try {
        const shopCount = await Shop.countDocuments(condition);
        res.status(200).json(shopCount);
    } catch (err) {
        next(err);
    }
};

// COUNT SHOPS BY TYPE
export const countByType = async (req, res, next) => {
    try {
        const shopCounts = await Shop.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);
        res.status(200).json(shopCounts);
    } catch (err) {
        next(err);
    }
};

// REMOVE IMAGES
export const removeImages = async (req, res, next) => {
    try {
        const shopId = req.params.shopId;
        const { images } = req.body;

        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ success: false, message: "No images provided for deletion" });
        }

        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ success: false, message: "Shop not found" });
        }

        const deletePromises = images.map(imgUrl => {
            const publicId = imgUrl.split('/').slice(-2).join('/').split('.')[0];
            return cloudinary.v2.uploader.destroy(publicId);
        });

        await Promise.all(deletePromises);

        const updatedShop = await Shop.findByIdAndUpdate(
            shopId,
            { $pull: { photos: { $in: images } } },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Images removed successfully", shop: updatedShop });
    } catch (err) {
        console.error('Remove images error:', err);
        next(err);
    }
};

// UPLOAD IMAGES
export const uploadImages = async (req, res, next) => {
    try {
        const shopId = req.params.shopId;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No files uploaded" });
        }

        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ success: false, message: "Shop not found" });
        }

        const uploadPromises = req.files.map(file =>
            cloudinary.v2.uploader.upload(file.path, { folder: "shops" })
        );

        const results = await Promise.all(uploadPromises);
        const imageUrls = results.map(result => result.secure_url);

        const updatedShop = await Shop.findByIdAndUpdate(
            shopId,
            { $push: { photos: { $each: imageUrls } } },
            { new: true }
        );

        res.status(200).json({ success: true, shop: updatedShop });
    } catch (err) {
        console.error('Upload error:', err);
        next(err);
    }
};
