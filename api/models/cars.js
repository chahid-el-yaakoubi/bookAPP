import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    // Basic car details
    carMake: { type: String, required: true }, // Car's brand (e.g., Toyota)
    carModel: { type: String, required: true }, // Model of the car (e.g., Corolla)
    ownerName: { type: String, required: true }, // Name of the car owner
    contactNumber: { type: String, required: true }, // Phone number for contact
    email: { type: String, required: true }, // Email address for contact
    location: {
        region: { type: String, required: true }, // Region where the car is located
        city: { type: String, required: true }, // City where the car is located
        neighborhood: { type: String }, // Optional neighborhood
        coordinates: { type: String }, // Optional GPS coordinates
    },
    type: { type: String, required: true }, // Type of car (e.g., Sedan, SUV)
    price: { type: Number, required: true }, // Price per day or rental period
    currency: { type: String, default: "USD" }, // Currency for the price
    mileage: { type: Number, required: true }, // Current mileage of the car
    year: { type: Number, required: true }, // Year of manufacture
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
        hasChildSeats: { type: Boolean, default: false },
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
    registration: {
        plateNumber: { type: String, required: true }, // Registration plate
        registrationState: { type: String }, // State of registration
    },
    description: { type: String }, // Additional details about the car
});

// Export the schema
const CarRental = mongoose.model("CarRental", carSchema);

export default CarRental;
