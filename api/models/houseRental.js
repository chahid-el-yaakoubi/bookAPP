import mongoose from 'mongoose';
// import { type } from 'os';

const houseRentalSchema = new mongoose.Schema({
    isA: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['apartment', 'villa', 'house', 'studio', 'duplex', 'penthouse'] },
    description: { type: String },
    status: { type: String, default: 'available', enum: ['available', 'rented', 'maintenance'] },
    featured: { type: Boolean, default: false },
    location: {
        region: { type: String, },
        city: { type: String, },
        neighborhood: { type: String, },
        coordinates: { type: String },
        distanceFromCityCenter: { type: Number },
        nearbyPlaces: {
            school: { type: Number },
            supermarket: { type: Number },
            beach: { type: Number },
            restaurants: { type: Number },
            mosques: { type: Number },
            souq: { type: Number }
        }
    },
    contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
        whatsapp: { type: String }
    },
    photos: {
        type: [String], // Array of URLs to store image paths
        default: [] // Default to an empty array if no photos are uploaded
    },
    rental: {
        price: { type: Number},
        negotiable: { type: Boolean, default: false },
        luxury: { type: Boolean, default: false },
        lastRenovated: { type: Date }
    },
    syndicDetails: {
        monthlyFees:  { type: Number},
        servicesIncluded: [{ type: String }],
    },
    specifications: {
        size: { type: Number, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        floor: { type: Number },
        totalFloors: { type: Number },
        yearBuilt: { type: Number },
    },
    amenities: {
        balcony: { type: Boolean, default: false },
        terrace: { type: Boolean, default: false },
        elevator: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        view: {
            type: String,
            enum: ['city', 'sea', 'garden', 'mountain', 'street', 'park', '']
        },
        kitchen: [{ type: String }],
        heating: {
            type: String,
            enum: ['central', 'electric', 'gas', 'none', '']
        },
        airConditioning: {
            installed: { type: Boolean, default: false },
            units: { type: Number }
        },
        internet: { type: Boolean, default: false },
        soundproofing: { type: Boolean, default: false },
        thermalInsulation: { type: Boolean, default: false }
    },
    Furnishing: {
        status: { type: Boolean, default: false },
        furniture: [{type: String}],
    },
    security: {
        concierge: { type: Boolean, default: false },
        securityDoors: { type: Boolean, default: false },
        surveillanceSystem: { type: Boolean, default: false }
    },

}, {
    timestamps: true
});

// Indexes for better query performance
houseRentalSchema.index({ 'location.region': 1, 'location.city': 1 });
houseRentalSchema.index({ 'rental.price': 1 });
houseRentalSchema.index({ 'specifications.bedrooms': 1 });
houseRentalSchema.index({ status: 1 });
houseRentalSchema.index({ featured: 1 });

const HouseRental = mongoose.model('HouseRental', houseRentalSchema);

export default HouseRental;