import mongoose from 'mongoose';

const houseRentalSchema = new mongoose.Schema({
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
    rental: {
        price: { type: Number, required: true },
        propertyType: {
            type: String,
            required: true,
            enum: ['residential', 'commercial', 'land']
        },
        negotiable: { type: Boolean, default: false },
        propertyAge: { type: Number },
        lastRenovated: { type: Date }
    },
    specifications: {
        size: { type: Number, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        floor: { type: Number },
        totalFloors: { type: Number },
        yearBuilt: { type: Number },
        parking: { type: Boolean, default: false },
        petsAllowed: { type: Boolean, default: false }
    },
    amenities: {
        balcony: { type: Boolean, default: false },
        terrace: { type: Boolean, default: false },
        elevator: { type: Boolean, default: false },
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
    security: {
        concierge: { type: Boolean, default: false },
        securityDoors: { type: Boolean, default: false },
        surveillanceSystem: { type: Boolean, default: false }
    }
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