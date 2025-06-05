import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        //   
    },
    // Basic car details
    carDetails: {
        carMake: { type: String,   }, // Brand (e.g., Renault, Dacia, Peugeot)
        carModel: { type: String,   }, // Model (e.g., Clio, Sandero, 208)
        year: { type: Number,   }, // Manufacturing year
        color: { type: String,   },
        registrationCity: { type: String }, // Moroccan registration city (e.g., Casablanca, Rabat)
        plateNumber: { 
            type: String, 
             
            
        }
    },
    specifications: {
        seats: { type: Number,   min: 2, max: 9 }, // Number of seats
        doors: { type: Number,   min: 2, max: 5 }, // Number of doors
        transmission: { 
            type: String, 
             
            enum: ['Automatic', 'Manual', 'Semi-automatic'] 
        },
        engineSize: { type: Number }, // Engine size in cc
        horsepower: { type: Number }, // Engine power in CV (cheval-vapeur)
        fuel: {
            type: { 
                type: String, 
                 
                enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid'] 
            },
            consumption: { type: String }, // Fuel consumption (e.g., "5L/100km")
            policy: { 
                type: String,
                enum: ['Full-to-Full', 'Full-to-Empty', 'Prepaid'], 
                default: 'Full-to-Full'
            },
        }
    },
    location: {
        region: { 
            type: String, 
             
            // enum: ['Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Marrakech-Safi', 'Fès-Meknès', 
            //       'Tanger-Tétouan-Al Hoceïma', 'Souss-Massa', 'Oriental', 'Béni Mellal-Khénifra', 
            //       'Drâa-Tafilalet', 'Laâyoune-Sakia El Hamra', 'Dakhla-Oued Ed-Dahab']
        },
        city: { type: String,   }, // e.g., Casablanca, Marrakech
        exactAddress: { type: String }, // Detailed address
        coordinates: {
            latitude: { type: Number }, // GPS coordinates
            longitude: { type: Number },
        }
    },
    category: { 
        type: String,
        enum: ['Economy', 'Compact', 'Mid-size', 'Full-size', 'Premium', 'Luxury', 
              'SUV', 'Minivan', 'Convertible', 'Commercial'],
          
    },
    pricing: {
        dailyRate: { type: Number,   }, // Daily price in MAD
        weeklyDiscount: { type: Number, default: 0 }, // Weekly discount percentage
        monthlyDiscount: { type: Number, default: 0 }, // Monthly discount percentage
        securityDeposit: { type: Number,   }, // Deposit amount in MAD
        additionalKmPrice: { type: Number, default: 0 }, // Price per extra kilometer
    },
    features: {
        airConditioning: { type: Boolean, default: false },
        navigation: { type: Boolean, default: false },
        bluetooth: { type: Boolean, default: false },
        usbPort: { type: Boolean, default: false },
        sunroof: { type: Boolean, default: false },
        childSeat: { type: Boolean, default: false },
        gpsTracker: { type: Boolean, default: false }, // Important for Moroccan rentals
        smokingAllowed: { type: Boolean, default: false },
        additionalFeatures: [{ type: String }]
    },
    insurance: {
        basicCoverage: { type: Boolean, default: true }, // CDW (Collision Damage Waiver)
        premiumCoverage: { type: Boolean, default: false },
        theftProtection: { type: Boolean, default: false },
        roadsideAssistance: { type: Boolean, default: false },
        policyDetails: { type: String }
    },
    rentalTerms: {
        minimumAge: { type: Number, default: 21 }, // Minimum age to rent
        minimumRentalDays: { type: Number, default: 1 },
        licenseRequirement: { 
            type: String, 
            default: 'Moroccan or International license (1+ years)'
        },
        deliveryOptions: {
            airportDelivery: { type: Boolean, default: false },
            cityDelivery: { type: Boolean, default: false },
            deliveryFee: { type: Number, default: 0 },
            freeDeliveryDistance: { type: Number, default: 0 } // km for free delivery
        },
        mileageLimit: { type: Number, default: 200 }, // Daily km limit
        lateReturnPolicy: { type: String },
        cancellationPolicy: { 
            type: String,
            enum: ['Flexible', 'Moderate', 'Strict'],
            default: 'Moderate'
        }
    },
    media: {
        photos: [{ type: String,   }],
        videos: [{ type: String }],
        mainPhoto: { type: String } // URL of the main photo to display
    },
    status: { 
        type: String, 
        enum: ['Available', 'Rented', 'Maintenance', 'Unavailable'],
        default: "Available" 
    },
    availability: {
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        blackoutDates: [{ type: Date }], // Dates when car is unavailable
        instantBooking: { type: Boolean, default: true } // Allow instant booking or require approval
    },
    documents: {
        registrationCard: { type: String,   }, // Carte Grise scan
        insuranceCertificate: { type: String,  }, // Attestation d'assurance
        technicalInspection: { type: String }, // Contrôle technique
        additionalDocuments: [{ type: String }]
    },
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5,   },
        comment: { type: String, maxlength: 500 },
        date: { type: Date, default: Date.now },
        response: { // Owner response to review
            text: { type: String },
            date: { type: Date }
        }
    }],
    bookingHistory: [{
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        renterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        startDate: { type: Date },
        endDate: { type: Date },
        totalPrice: { type: Number },
        status: { 
            type: String,
            enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-show']
        }
    }],
    verification: {
        isVerified: { type: Boolean, default: false }, // Admin verification status
        verificationDate: { type: Date },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        verificationNotes: { type: String } // Admin verification comments
    },
    popularityMetrics: {
        views: { type: Number, default: 0 },
        bookings: { type: Number, default: 0 },
        favoriteCount: { type: Number, default: 0 }
    },
    maintenanceRecords: [{
        date: { type: Date },
        description: { type: String },
        cost: { type: Number },
        nextScheduled: { type: Date }
    }]
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for average rating
carSchema.virtual('averageRating').get(function() {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / this.reviews.length).toFixed(1);
});

// Virtual for rental count
carSchema.virtual('rentalCount').get(function() {
    return this.bookingHistory.length;
});

// Virtual for computed price with discounts
carSchema.virtual('discountedRates').get(function() {
    const daily = this.pricing.dailyRate;
    const weekly = daily * 7 * (1 - this.pricing.weeklyDiscount / 100);
    const monthly = daily * 30 * (1 - this.pricing.monthlyDiscount / 100);
    
    return {
        daily,
        weekly,
        monthly
    };
});

// Pre-save middleware to ensure mainPhoto is set
carSchema.pre('save', function(next) {
    // If photos exist but no main photo is set, use the first photo
    if (this.media.photos && this.media.photos.length > 0 && !this.media.mainPhoto) {
        this.media.mainPhoto = this.media.photos[0];
    }
    next();
});

// Methods
carSchema.methods.isAvailableForDates = function(startDate, endDate) {
    // Check if car is available for the given date range
    if (this.status !== 'Available') return false;
    
    // Check against blackout dates
    const blackoutConflict = this.availability.blackoutDates.some(date => {
        return date >= startDate && date <= endDate;
    });
    
    if (blackoutConflict) return false;
    
    // Check against existing bookings
    const bookingConflict = this.bookingHistory.some(booking => {
        if (booking.status === 'Cancelled') return false;
        return (
            (startDate >= booking.startDate && startDate <= booking.endDate) ||
            (endDate >= booking.startDate && endDate <= booking.endDate) ||
            (booking.startDate >= startDate && booking.startDate <= endDate)
        );
    });
    
    return !bookingConflict;
};

// Indexes for better query performance
carSchema.index({ 'location.city': 1 });
carSchema.index({ 'location.region': 1 });
carSchema.index({ 'carDetails.carMake': 1 });
carSchema.index({ 'carDetails.carModel': 1 });
carSchema.index({ 'pricing.dailyRate': 1 });
carSchema.index({ status: 1 });
carSchema.index({ category: 1 });
carSchema.index({ 'specifications.transmission': 1 });
carSchema.index({ 'specifications.fuel.type': 1 });
carSchema.index({ created_by: 1 });
carSchema.index({ 'verification.isVerified': 1 });

const Car = mongoose.model('Car', carSchema);

export default Car;