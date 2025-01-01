import mongoose from 'mongoose';

const houseRentalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: {
        city: String,
        address: String,
        latitude: String,
        longitude: String,
        distanceFromCityCenter: String
    },
    contact: {
        phone: String,
        email: String,
        whatsapp: String
    },
    description: String,
    sale: {
        price: { type: Number, required: true },
        propertyType: String,
        saleType: String,
        negotiable: { type: Boolean, default: false },
        paymentTerms: String,
        titleDeedStatus: String,
        propertyAge: Number,
        lastRenovated: Date
    },
    details: {
        size: { type: Number, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        floor: Number,
        totalFloors: Number,
        yearBuilt: Number,
        parking: { type: Boolean, default: false },
        petsAllowed: { type: Boolean, default: false }
    },
    features: {
        balcony: {
            exists: { type: Boolean, default: false },
            size: String,
            view: String
        },
        terrace: {
            exists: { type: Boolean, default: false },
            size: String,
            view: String
        },
        kitchen: {
            type: String,
            equipment: [String]
        },
        bathroom: {
            count: Number,
            features: [String]
        },
        heating: {
            type: String
        },
        airConditioning: {
            installed: { type: Boolean, default: false },
            units: Number
        },
        internet: {
            available: { type: Boolean, default: false },
            type: String,
            speed: String
        },
        soundproofing: { type: Boolean, default: false },
        thermalInsulation: { type: Boolean, default: false }
    },
    proximity: {
        restaurants: {
            closest: String,
            walkingTime: String
        },
        cafes: {
            closest: String,
            walkingTime: String
        }
    },
    amenities: {
        basic: {
            wifi: { type: Boolean, default: false },
            airConditioning: { type: Boolean, default: false },
            heating: { type: Boolean, default: false },
            elevator: { type: Boolean, default: false },
            parking: { type: Boolean, default: false }
        },
        kitchen: {
            refrigerator: { type: Boolean, default: false },
            microwave: { type: Boolean, default: false },
            stove: { type: Boolean, default: false },
            dishwasher: { type: Boolean, default: false },
            washingMachine: { type: Boolean, default: false }
        },
        outdoor: {
            balcony: { type: Boolean, default: false },
            garden: { type: Boolean, default: false },
            terrace: { type: Boolean, default: false }
        },
        security: {
            securitySystem: { type: Boolean, default: false },
            cctv: { type: Boolean, default: false },
            doorman: { type: Boolean, default: false }
        }
    },
    utilities: {
        electricity: { type: Boolean, default: false },
        water: { type: Boolean, default: false },
        internet: { type: Boolean, default: false },
        gas: { type: Boolean, default: false }
    },
    status: { 
        type: String, 
        enum: ['available', 'rented', 'pending', 'maintenance'],
        default: 'available'
    },
    featured: { type: Boolean, default: false },
    locationDetails: {
        distanceToSchool: String,
        schoolTransportPrice: Number,
        nearestSchools: [String],
        distanceToBeach: String,
        nearestBeaches: [String],
        parkingDetails: {
            type: String,
            distance: String,
            pricePerMonth: Number
        },
        transportation: {
            busStopDistance: String,
            busLines: [String],
            taxiStandDistance: String,
            averageTaxiFare: Number
        },
        nearbyAmenities: {
            groceryStores: String,
            restaurants: String,
            cafes: String,
            mosques: String,
            hospitals: String,
            pharmacies: String
        },
        neighborhood: String,
        landmarks: {
            distanceToMosque: String,
            distanceToSouq: String,
            distanceToCornicheNador: String,
            distanceToMarcheCentral: String
        },
        publicTransport: {
            grandTaxiStation: String,
            busStation: String,
            distanceToSpanishBorder: String
        },
        schools: {
            arabicSchools: [String],
            frenchSchools: [String],
            spanishSchools: [String],
            languageInstitutes: [String]
        }
    },
    propertyDetails: {
        constructionType: String,
        facadeDirection: String,
        waterSystem: {
            hasWaterTank: { type: Boolean, default: false },
            tankCapacity: String,
            waterPressure: String
        },
        securityFeatures: {
            hasConcierge: { type: Boolean, default: false },
            hasSecurityDoors: { type: Boolean, default: false },
            hasSurveillanceSystem: { type: Boolean, default: false }
        }
    }
}, {
    timestamps: true
});

const HouseRental = mongoose.model('HouseRental', houseRentalSchema);

export default HouseRental; 