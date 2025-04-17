import express from 'express';
import {
  createBooking,
  getAllBookings,
  checkAvailability,
  updateBooking,
  deleteBooking
} from '../controllers/booking.js';

const router = express.Router();

router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.get('/', getAllBookings);
router.post('/check', checkAvailability);

export default router;
