import express from 'express';
const router = express.Router();

import { creatHouse, getHouse, getHouses, updateHouse, deleteHouse, countByCity, countByType, uploadImgs, removeImgs, getAdminHouses } from '../controllers/houseRental.js';
import { verifyAdmin } from '../utils/verifyToken.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

// CREATE  
router.post('/', verifyAdmin, creatHouse);



// UPDATE 
router.put('/:id', verifyAdmin, updateHouse);
// DELETE
router.delete('/:id', verifyAdmin, deleteHouse)
// GET
router.get('/find/:id', getHouse)
// GET ALL
router.get('/', getHouses)
// get house admin
router.get('/:id', getAdminHouses)

router.get('/contByCity/count/:id', countByCity)
router.get('/countByType', countByType)



// UPLOAD IMAGES
router.post('/:houseId/upload', verifyAdmin, upload.array('images', 10), uploadImgs);

// REMOVE IMAGES
router.delete('/:houseId/photos', verifyAdmin, removeImgs);


export default router