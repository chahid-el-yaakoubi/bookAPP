import express from 'express';
const router = express.Router();
import { verifyAdmin } from '../utils/verifyToken.js';
import { createRoom, getRoom, getRooms, updateRoom, deleteRoom, uploadImgs, getRoomPhotos, deleteRoomImg } from '../controllers/room.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });


// CREATE  
router.post('/:hotelId', verifyAdmin, createRoom);
// UPDATE 
router.put('/:id', verifyAdmin, updateRoom)
// DELETE
router.delete('/:id/:hotelId', verifyAdmin, deleteRoom)
// GET
router.get('/:id', getRoom)
// GET ALL
router.get('/:hotelId/find', getRooms)

router.post('/:roomId/upload', verifyAdmin, upload.array('images', 10), uploadImgs);

router.delete('/:roomId/photos/remove', deleteRoomImg);


router.get('/:id/photos', getRoomPhotos);



export default router