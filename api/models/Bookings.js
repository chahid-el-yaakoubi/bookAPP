import mongoose from 'mongoose';

// ========================
// 1. PAYMENT SCHEMA (unchanged)
// ========================
const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'paypal', 'other'],
    required: true
  },
  cardLast4: {
    type: String,
    validate: {
      validator: function(v) {
        return this.method !== 'card' || (v && /^\d{4}$/.test(v));
      },
      message: 'Last 4 digits are required for card payments'
    }
  },
  cardBrand: {
    type: String,
    enum: ['visa', 'mastercard', 'amex', 'discover', 'other'],
    required: function() { return this.method === 'card'; }
  },
  transactionId: {
    type: String,
    required: function() {
      return ['card', 'bank_transfer', 'paypal'].includes(this.method);
    }
  },
  cashReceived: {
    type: Boolean,
    default: function() { return this.method === 'cash'; }
  },
  receiptNumber: {
    type: String,
    required: function() { return this.method === 'bank_transfer'; }
  }
}, { _id: false });

// ========================
// 2. BOOKING SCHEMA (with auto-ID based on count)
// ========================
const bookingSchema = new mongoose.Schema({
  bookingId: { 
    type: String, 
    unique: true,
    index: true 
  },
  created_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User'
  },
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Hotel'
  },
  roomId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  guests: { 
    type: Number, 
    required: true 
  },
  guestName: { 
    type: String, 
    required: true 
  },
  guestPhone: {
    type: String,
    required: true
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  payment: {
    type: paymentSchema,
    required: true
  },
  notes: String
}, { timestamps: true });

// ========================
// 3. AUTO-INCREMENT MIDDLEWARE (using count)
// ========================
bookingSchema.pre('save', async function(next) {
  if (!this.isNew || this.bookingId) return next();

  try {
    const lastBooking = await Booking.findOne({}, { bookingId: 1 }).sort({ createdAt: -1 });
    const lastId = lastBooking ? parseInt(lastBooking.bookingId.replace('BK', '')) : 100; // Default to 100 if no bookings exist
    this.bookingId = `BK${lastId + 1}`; // Increment from the last bookingId
    next();
  } catch (err) {
    next(err);
  }
});

// ========================
// 4. INDEXES
// ========================
bookingSchema.index({ propertyId: 1, startDate: 1, endDate: 1 });

// ========================
// 5. MODEL EXPORT
// ========================
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;