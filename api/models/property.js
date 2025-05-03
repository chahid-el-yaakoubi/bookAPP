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


const BathroomSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    amenities: {
      type: Map,
      of: Boolean,
      default: {}
    },
    type: { type: String },
  });

  
// const RoomsSchema = new mongoose.Schema({
//     id: { type: Number, required: true },
//     features: {
//       type: Map,
//       of: Boolean,
//       default: {}
//     },
//     beds : [{
//         type: { type: String,  }, 
//         count: { type: Number,   }   
//     }],
//   });
  
// Update the property_details schema to include spaces
const PropertyDetailsSchema = new Schema({
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
    bathrooms: [BathroomSchema ],
    // rooms :  [RoomsSchema ],
});


const HotelSchema = new mongoose.Schema({
    created_by: { type: String, require : true , ref: "User",},
    title: { type: String },
    rating: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
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
        addressEn: { type: String },
        addressAr: { type: String },
        city: { type: String },
        country: { type: String, default: 'morocco' },
        region: { type: String },
        postal_code: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        neighborhood: { type: String },
    },
    property_details: PropertyDetailsSchema,
    pricing: {
        nightly_rate: { type: Number, required: false },
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
        bookingStatus: { 
            type: String, 
            enum: ['available', 'booked', 'maintenance'],
            default: 'maintenance'
        },
        status: { 
            type: String, 
            enum: ['pending', 'accepted', 'declined'],
            default: 'pending' 
        },
        message: { type: String },
    },
    description: {
        listingDescription: {
            type: String,
            trim: true,
            default: 'no description yet',
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
    },
    rooms: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room' 
    }],
}, {
    timestamps: true,
});

const Hotel = mongoose.model('Hotel', HotelSchema);

// Function to add a new space to a property


export default Hotel;
