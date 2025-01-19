import express from 'express';
const router = express.Router();
import { 
    createCar, 
    getCar, 
    getCars, 
    updateCar, 
    deleteCar, 
    countByCity, 
    countByType, 
    uploadImgs, 
    removeImgs,
    getAdminCars
} from '../controllers/cars.js'; // Update the path to your car controller
import { verifyAdmin, verifyToken } from '../utils/verifyToken.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

// CREATE CAR
router.post('/', verifyAdmin, createCar);

// UPDATE CAR
router.put('/:id', verifyAdmin, updateCar);

// DELETE CAR
router.delete('/:id', verifyAdmin, deleteCar);

// GET SINGLE CAR
router.get('/find/:id', getCar);

// GET ALL CARS
router.get('/', getCars);


// GET ALL CARS
router.get('/:id', getAdminCars);

// COUNT CARS BY CITY
router.get('/countCars/count/:id', countByCity);

// COUNT CARS BY TYPE
router.get('/countByType', countByType);

// UPLOAD IMAGES FOR CAR
router.post('/:carId/upload', verifyAdmin, upload.array('images', 10), uploadImgs);

// REMOVE IMAGES FROM CAR
router.delete('/:carId/photos', verifyAdmin, removeImgs);

export default router;