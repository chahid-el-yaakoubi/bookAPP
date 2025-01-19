import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    isA: { type: String, required: true },
    // Basic car details
    carDetails: {
        carMake: { type: String, required: true }, // Car's brand (e.g., Toyota)
        carModel: { type: String, required: true }, // Model of the car (e.g., Corolla
    },
    numberplaces: { type: Number, required: true }, // Number of places
    autoManual: { type: String, required: true }, // Automatic or Manual transmission
    location: {
        region: { type: String, required: true }, // Region where the car is located
        city: { type: String, required: true }, // City where the car is located
        neighborhood: { type: String }, // Optional neighborhood
        coordinates: { type: String }, // Optional GPS coordinates
    },
    type: { type: String }, // Type of car (e.g., Sedan, SUV)
    price: { type: Number, required: true }, // Price per day or rental period
    fuel: {
        type: { type: String, required: true }, // Fuel type (e.g., Petrol, Diesel)
        policy: { type: String }, // Fuel policy (e.g., Full-to-Full)
    },
    amenities: {
        hasAirConditioning: { type: Boolean, default: false },
        hasParkingSensors: { type: Boolean, default: false },
        hasBluetooth: { type: Boolean, default: false },
        hasNavigation: { type: Boolean, default: false },
        hasHeatedSeats: { type: Boolean, default: false },
        hasSunroof: { type: Boolean, default: false },
    },
    // insurance: {
    //     policyNumber: { type: String }, // Insurance policy ID
    //     coverageType: { type: String }, // Type of insurance coverage
    //     expiryDate: { type: Date }, // Expiry date of insurance
    // },
    rentalTerms: {
        minimumPeriod: { type: Number }, // Minimum rental duration in days
        maximumMileage: { type: Number }, // Max mileage allowed
        lateReturnFee: { type: Number }, // Fee for returning the car late
    },
    photos: [{ type: String }],
    status: { type: String, default: "Available" }, // Car's status (Available, Rented)
    availability: {
        startDate: { type: Date }, // Availability start date
        endDate: { type: Date }, // Availability end date
    },
    reviews: [
        {
            user: { type: String }, // User who gave the review
            rating: { type: Number, min: 0, max: 5 }, // Rating (0-5)
            comment: { type: String }, // Review comment
        },
    ],
    bookingHistory: [
        {
            renterName: { type: String }, // Name of the renter
            startDate: { type: Date }, // Rental start date
            endDate: { type: Date }, // Rental end date
            totalAmount: { type: Number }, // Total payment
        },
    ],
    plateNumber: { type: String, required: true }, // Registration plate
}, { timestamps: true });

// Export the schema
const CarRental = mongoose.model("CarRental", carSchema);

export default CarRental;
