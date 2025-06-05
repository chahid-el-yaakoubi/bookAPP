// import Hotel from '../models/hotel.js';
import Booking from '../models/Bookings.js';

import dotenv from 'dotenv';
// import { console } from 'inspector';
dotenv.config();

export const createBooking = async (req, res) => {
    try {
      const newBooking = new Booking(req.body);
      await newBooking.save();
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


export const updateBooking = async (req, res) => {
    try {
      const { id } = req.params; // نفترض أن ID الحجز موجود في رابط الطلب
      const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedBooking) {
        return res.status(404).json({ error: 'Booking not found!' });
      }
  
      res.status(200).json(updatedBooking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Delete one booking by ID
export const deleteBooking = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedBooking = await Booking.findByIdAndDelete(id);
  
      if (!deletedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
  
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  

//   Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('created_by propertyId roomId');
    res.json(bookings);
    console.log(bookings[6]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBooking = async (req, res) => {
  try {
    const { idBK } = req.params;

    const booking = await Booking.findById(idBK)
      .populate('created_by')
      .populate('propertyId')
      .populate('roomId');
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//   Get all bookings partner
export const getAllBookingsPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const bookings = await Booking.find({ 'created_by': partnerId }).populate('created_by propertyId roomId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Check availability
export const checkAvailability = async (req, res) => {
  const { houseId, startDate, endDate } = req.body;
  try {
    const overlap = await Booking.findOne({
      houseId,
      $or: [
        { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } }
      ]
    });

    if (overlap) {
      return res.json({ available: false });
    }
    res.json({ available: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};