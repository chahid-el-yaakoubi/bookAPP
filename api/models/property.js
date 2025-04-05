import mongoose from 'mongoose';
const { Schema } = mongoose;
 

const NearbyItemSchema = new Schema({
    id: {
        type: String,
    },
    name: {
        type: String,
        trim: true
    },
    distance: {
        type: String,
        trim: true
    },
    details: {
        type: String,
        trim: true
    }
});

// Schema for additional networks
const AdditionalNetworkSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    }
});

//   TTask Schema - defines the structure for each checkout task
const TaskSchema = new Schema({
    id: {
        type: String,
        enum: ['trash', 'cleaning', 'thermostat', 'lights', 'lock_up']
    },
    title: {
        type: String,
    },
    content: {
        type: String,
        default: ''
    },
    enabled: {
        type: Boolean,
        default: false
    }
});

// Define the schema for spaces
const spaceSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto-generated unique ID
    type: { type: String,  }, // Type of space (e.g., 'Art Studio', 'Backyard')
    amenities: { type: [String], default: [] }, // Array of amenities
    privateInfo: { type: [String], default: [] }, // Array of amenities
    photos: { type: [String], default: [] }, // Array of photo URLs
});

// Update the property_details schema to include spaces
const PropertyDetailsSchema = new Schema({
    rooms: { type: Number },
    bathrooms: { type: Number },
    max_guests: { type: Number },
    size_sqm: { type: Number },
    amenities: {
        standard: { type: [String], default: [] },
        custom: { type: [String], default: [] }
    },
    propertyFeatures: {
        standard: { type: [String], default: [] },
        custom: { type: [String], default: [] }
    },
    photos: {
        type: [
            {
                url: { type: String },  // URL of the photo
                type: { type: String} ,// Category (e.g., "bathroom", "kitchen")
                idRoom: { type: String},
            }
        ],
        default: []
    },
    bathroom: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        type: { type: String },
        amenities: { type: [String], default: [] },
        photos: { type: [String], default: [] },
    }],
    spaces: [spaceSchema], // New field for spaces
});

const HotelSchema = new mongoose.Schema({
    owner_name: { type: String },
    title: { type: String },
    type: {
        type: {
            type: String,
            // enum: ['hotel', 'apartment', 'resort', 'villa', 'cabin', 'guesthouse', 'hostel', 'boutique']
        },
        category: {
            type: String,
        },
        listingType: {
            type: String,
            //   enum: ['Entire place', 'Private room', 'Shared room']
        },
        floors: {
            type: Number,
            default: 1
        },
        floorNumber: {
            type: Number,
            default: 1
        },
        yearBuilt: {
            type: String
        },
        size: {
            type: String
        },
        sizeUnit: {
            type: String,
            enum: ['Unit', 'sq ft', 'sq m²'],
            default: 'Unit'
        },
        totalUsers: {
            type: Number
        },
        viewType : {type: String},
    },
    checkout_instructions: { tasks: [TaskSchema], },
    location: {
        address: { type: String },
        city: { type: String },
        country: { type: String, default: 'morocco' },
        region: { type: String },
        postal_code: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        neighborhood: { type: String },
        nearby_landmarks: { type: [String] },
    },
    property_details: PropertyDetailsSchema,
    pricing: {
        nightly_rate: { type: Number, required: true },
        Weekend_price: { type: Number, required: false },
        discounts: {
            weekly_discount: { type: Number, required: false },
            monthly_discount: { type: Number, required: false }
        },
        smart_pricing: {
            enabled: { type: Boolean, default: false },
            min: { type: Number, required: false },
            max: { type: Number, required: false }
        }
    },
    booking_policy: {
        check_in: { type: String },
        check_out: { type: String },
        cancellation_policy: { type: String },
        pets_allowed: { type: Boolean, default: false },
        smoking_allowed: { type: Boolean, default: false },
    },
    status: {
        bookingStatus: { type: String },
        status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
        message: { type: String },
    },
    description: {
        listingDescription: {
            type: String,
            trim: true,
            default: 'fix',
        },
        yourProperty: {
            type: String,
            trim: true,
        },
        guestAccess: {
            type: String,
            trim: true,
        },
        interactionWithGuests: {
            type: String,
            trim: true,
        },
        otherDetails: {
            type: String,
            trim: true,
        }
    },
    proximities: {
        restaurants: [NearbyItemSchema],
        publicTransit: [NearbyItemSchema],
        airports: [NearbyItemSchema],
        attractions: [NearbyItemSchema],
        beaches: [NearbyItemSchema],
        bookingPlaces: [NearbyItemSchema],
        walkingRoutes: [NearbyItemSchema],

    },
    available: {
        tripLength: {
            minimumNights: { type: Number, default: 1, min: 1 },
            maximumNights: { type: Number, default: 365, min: 1 }
        },
        advanceNotice: {
            noticeRequired: {
                type: String,
                enum: ['same_day', '24h', '48h', '3d', '7d'],
                default: '7d'
            },
            allowExceptions: { type: Boolean, default: true }
        },
        calendar: [{
            date: { type: Date },
            available: { type: Boolean, default: true },
            customPrice: { type: Number, min: 0 }
        }],
        preparationTime: {
            type: Number,
            default: 0,
            min: 0,
            max: 3
        }
    },
    accessibility_features: {
        step_free: { type: Boolean, default: false },
        elevator: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        wide_entrance: { type: Boolean, default: false },
        roll_shower: { type: Boolean, default: false },
        accessible_toilet: { type: Boolean, default: false }
    },
    policies: {
        checkInOutTimes: {
            checkInWindow: {
                start: { type: String },
                end: { type: String }
            },
            checkoutTime: { type: String }
        },
        rules: {
            max_guests: { type: Number },
            commercial: { type: String },
            events: { type: String },
            smoking: { type: String },
            pets: {
                allowed: { type: Boolean },
                maxCount: { type: Number }
            },
            quietHours: {
                pending: { type: Boolean, default: false },
                startTime: { type: String },
                endTime: { type: String }
            },
            additionalRules: { type: [String], default: [] },
        }
    },
    safety_features: {
        safety: { type: [String], default: [] },
        customSafetyItems: { type: [String], default: [] }
    },
    cancellation: {
        policyType: {
            type: { type: String },
        },
        policyDetails: {
            name: { type: String },
            tiers: { type: Array, default: [] },
        },
        customRules: { type: Array, default: [] },
        lastUpdated: { type: String, default: () => new Date().toISOString() },
    },
    wifi: {
        networkName: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            trim: true,
            // Consider encryption for sensitive data
        },
        additionalNetworks: [AdditionalNetworkSchema],
        notes: {
            type: String,
            trim: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    rooms: { type: [String], default: [] },
}, {
    timestamps: true,
});

const Hotel = mongoose.model('Hotel', HotelSchema);

// Function to add a new space to a property


export default Hotel;

export const addNewSpace = async (propertyId, newSpaceData) => {
    try {
        const property = await Hotel.findById(propertyId);
        if (!property) {
            throw new Error('Property not found');
        }

        // Create a new space object based on the schema
        const newSpace = {
            type: newSpaceData.type,
            amenities: newSpaceData.amenities || [],
            photos: newSpaceData.photos || [],
        };

        // Add the new space to the existing spaces array
        property.property_details.spaces.push(newSpace);

        // Save the updated property
        await property.save();
        return property;
    } catch (error) {
        console.error('Error adding new space:', error);
        throw error;
    }
};

// Function to update a space in a property
export const updateSpace = async (propertyId, spaceId, updatedSpaceData) => {
    try {
        const property = await Hotel.findById(propertyId);
        if (!property) {
            throw new Error('Property not found');
        }

        // Find the space to update
        const spaceIndex = property.property_details.spaces.findIndex(space => space._id.toString() === spaceId);
        if (spaceIndex === -1) {
            throw new Error('Space not found');
        }

        // Update the space
        property.property_details.spaces[spaceIndex] = {
            ...property.property_details.spaces[spaceIndex],
            ...updatedSpaceData,
        };

        // Save the updated property
        await property.save();
        return property;
    } catch (error) {
        console.error('Error updating space:', error);
        throw error;
    }
};

// Function to delete a space from a property
export const deleteSpace = async (propertyId, spaceId) => {
    try {
        const property = await Hotel.findById(propertyId);
        if (!property) {
            throw new Error('Property not found');
        }

        // Remove the space from the spaces array
        property.property_details.spaces = property.property_details.spaces.filter(space => space._id.toString() !== spaceId);

        // Save the updated property
        await property.save();
        return property;
    } catch (error) {
        console.error('Error deleting space:', error);
        throw error;
    }
};