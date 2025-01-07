import express from 'express';
const router = express.Router();
import { verifyAdmin } from '../utils/verifyToken.js';
import { 
    createCity,
    getCity,
    getCities,
    getCitiesByRegion,
    updateCity,
    deleteCity,
    addNeighbor,
    removeNeighbor,
    countByCity
} from '../controllers/cities.js';

// CREATE
router.post('/', verifyAdmin, createCity);

// GET ALL CITIES
router.get('/', getCities);

// GET CITIES BY REGION
router.get('/region/:region', getCitiesByRegion);

// GET SINGLE CITY
router.get('/:id', getCity);

// COUNT CARS BY CITY
router.get('/countByCity/count', countByCity);

// UPDATE CITY
router.put('/:id', verifyAdmin, updateCity);

// DELETE CITY
router.delete('/:id', verifyAdmin, deleteCity);

// ADD NEIGHBOR
router.patch('/:cityId/neighbors', verifyAdmin, addNeighbor);

// REMOVE NEIGHBOR
router.delete('/:cityId/neighbors',verifyAdmin, removeNeighbor);

export default router;