import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  created_by: { type: mongoose.Schema.Types.ObjectId,   required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId,   required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId,  }, // Optional
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  guests: { type: Number, required: true },
  guestName: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
