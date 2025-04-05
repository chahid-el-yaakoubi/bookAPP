import express from 'express';
const router = express.Router();
import { addNewSpace, updateSpace, deleteSpace } from '../models/property.js'; // Adjust the import based on your file structure


import { creatHotel, getHotel, getHotels, updateHotel, deleteHotel, countByCity, countByType, uploadImgs, removeImgs , getAdminHotels, getHotelPhotos, updatePhotoType} from '../controllers/hotel.js';
import { verifyAdmin } from '../utils/verifyToken.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

// CREATE  
router.post('/', verifyAdmin, creatHotel);



// UPDATE 
router.put('/:id', verifyAdmin, updateHotel);
// DELETE
router.delete('/:id', verifyAdmin, deleteHotel)
// GET
router.get('/find/:id', getHotel)
// GET ALL
router.get('/', getHotels)
//  get hotels admins
router.get('/:id', getAdminHotels)

// COUNT BY CITY
router.get('/contByCity/count/:id', countByCity)
router.get('/countByType', countByType)



// UPLOAD IMAGES
router.post('/:hotelId/upload', verifyAdmin, upload.array('images', 10), uploadImgs);
router.put('/:id/update_photo', verifyAdmin, updatePhotoType);

// REMOVE IMAGES
router.delete('/:hotelId/delete_photos', verifyAdmin, removeImgs);
router.get('/:id/photos', getHotelPhotos);

 

export default router