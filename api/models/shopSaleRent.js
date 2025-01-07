import mongoose from "mongoose";
import { type } from "os";

const shopSchema = new mongoose.Schema({
    isA: { type: String, required: true },

    shopName: {
        type: String,
        trim: true,
    },
    ownerName: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: String,
        match: /^[0-9]{10}$/, // Matches a 10-digit Moroccan phone number
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/, // Basic email validation
    },
    location: {
        region: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        neighborhood: {
            type: String,
            trim: true,
        },
        coordonates: {
            type: String,
            trim: true,
        },
    },
    type: {
        type: String,
        enum: ['Sale', 'Rent'], // Sale or Rent
    },
    price: {
        type: Number,
        min: 0,
    },
    rentalDuration: {
        type: String,
      // For rent only
        // required: function () {
        //     return this.type === 'Rent';
        // },
    },
    rentalDeposit: {
        type: Number,
        
    },
    area: {
        type: Number,
        min: 0, // Area in square meters
    },
    amenities: {
        hasElectricity: { type: Boolean, default: false },
        hasWater: { type: Boolean, default: false },
        hasParking: { type: Boolean, default: false },
        hasSecurity: { type: Boolean, default: false },
        hasAirConditioning: { type: Boolean, default: false },
        hasInternet: { type: Boolean, default: false },
        hasStorageSpace: { type: Boolean, default: false },
        hasBathroom: { type: Boolean, default: false },
    },
    proximity: {
        items: [{ type: String }],
    },
    photos: [{ type: String }],
    status: {
        type: String,
        enum: ['Available', 'Sold', 'Rented'],
        default: 'Available',
    },
    description: { type: String, trim: true },

}, { timestamps: true });

export default mongoose.model('Shop', shopSchema);


