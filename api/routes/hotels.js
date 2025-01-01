import express from 'express';
const router = express.Router();

import { creatHotel, getHotel, getHotels, updateHotel, deleteHotel, countByCity, countByType, uploadImgs, removeImgs } from '../controllers/hotel.js';
import { verifyAdmin } from '../utils/verifyToken.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

// CREATE  
router.post('/', async (req, res) => {
    try {
        const hotel = new Hotel(req.body);
        await hotel.save();
        res.status(201).json(hotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// UPDATE 
router.put('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json(hotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// DELETE
router.delete('/:id', verifyAdmin, deleteHotel)
// GET
router.get('/find/:id', getHotel)
// GET ALL
router.get('/', getHotels)
router.get('/contByCity', countByCity)
router.get('/countByType', countByType)



// UPLOAD IMAGES
router.post('/:hotelId/upload', verifyAdmin, upload.array('images', 10), uploadImgs);

// REMOVE IMAGES
router.delete('/:hotelId/photos', verifyAdmin, removeImgs);


export default router