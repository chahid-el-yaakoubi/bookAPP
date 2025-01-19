import express from 'express';
const router = express.Router();

import { 
    createShop, 
    getShop, 
    getShops, 
    updateShop, 
    deleteShop, 
    countByCity, 
    countByType, 
    uploadImages, 
    removeImages,
    getAdminShops 
} from '../controllers/shopSaleRent.js';
import { verifyAdmin } from '../utils/verifyToken.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

// CREATE SHOP
router.post('/', verifyAdmin, createShop);

// UPDATE SHOP
router.put('/:id', verifyAdmin, updateShop);

// DELETE SHOP
router.delete('/:id', verifyAdmin, deleteShop);

// GET SINGLE SHOP
router.get('/find/:id', getShop);

// GET ALL SHOPS
router.get('/', getShops);

// GET ALL SHOPS admin
router.get('/:id', getAdminShops);

// COUNT SHOPS BY CITY
router.get('/countByCity/count/:id', countByCity);

// COUNT SHOPS BY TYPE
router.get('/countByType', countByType);

// UPLOAD IMAGES FOR SHOP
router.post('/:shopId/upload', verifyAdmin, upload.array('images', 10), uploadImages);

// REMOVE IMAGES FROM SHOP
router.delete('/:shopId/photos', verifyAdmin, removeImages);

export default router;
