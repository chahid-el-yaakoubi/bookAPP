import express from 'express';
const router = express.Router();
import { verifyAdmin } from '../utils/verifyToken.js';
import { createRoom, getRoom, getRooms, updateRoom, deleteRoom } from '../controllers/room.js';


// CREATE  
router.post('/:hotelId', verifyAdmin, createRoom);
// UPDATE 
router.put('/:id', verifyAdmin, updateRoom)
// DELETE
router.delete('/:id/:hotelId', verifyAdmin, deleteRoom)
// GET
router.get('/:id', getRoom)
// GET ALL
router.get('/', getRooms)


export default router