import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rental: { type: mongoose.Schema.Types.ObjectId, ref: "Rental", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const hotelSchema = new mongoose.Schema({
  // Basic Information
  isA: { type: String, required: true },

  owner_name: {
    type: String,
  },
  title: {
    type: String,
    required: [true, 'Property title is required'],
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['hotel', 'apartment', 'resort', 'villa', 'cabin', 'guesthouse', 'hostel', 'boutique'],
  },
  location: {
    country: { type: String, default: 'morocco'},
    region: { type: String, },
    city: { type: String, },
    neighborhood: { type: String, },
    latitudeLongitude: { type: String, },
    distanceFromCityCenter: { type: Number, }
  },
  contact: {
    phone: {
      type: String,
    },
    bookPhone: {
      type: String,
    },
    website: {
      type: String,
    },
    email: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email regex
        },
        message: 'Please enter a valid email address',
      },
    },
  },

  description: {
    type: String,
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },

// Pricing
  pricing: {
    nightly_rate: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "MAD", enum: ["MAD", "USD", "EUR"] },
    cleaning_fee: { type: Number, default: 0, min: 0 },
    service_fee: { type: Number, default: 0, min: 0 },
    discounts: {
        weekly_discount: { type: Number, default: 0, min: 0, max: 100 }, 
        monthly_discount: { type: Number, default: 0, min: 0, max: 100 }
    }
},


  // Limited if house not hotel
  LIMITS: {
    max_guests: { type: Number },    
    rooms: { type: Number },         
    beds: { type: Number },          
    bathrooms: { type: Number }     
  },

  // Rental Details
  rental: {
    durationType: {
      type: String,
      enum: ['night', 'month', 'custom'],
      required: true,
    },
    customDays: {
      type: Number,
      min: 1,
      required: function () {
        return this.rental.durationType === 'custom';
      },
    },
    hasFurniture: {
      type: Boolean,
      required: function () {
        return this.rental.durationType === 'month';
      },
    },
  },

  // proximity

  proximity: {
    nearbyPlaces: [
      { name: { type: String }, distance: { type: String } }
    ],
    restaurants: [
      { name: { type: String }, type: { type: String }, distance: { type: String } }
    ],
    publicTransit: [
      { name: { type: String }, type: { type: String }, distance: { type: String } }
    ],
    beaches: [
      { name: { type: String }, distance: { type: String } }
    ],
    airports: [
      { name: { type: String }, distance: { type: String } }
    ]
  },

  // Amenities

  // amenities: {
  //   BasicAmenities: {
  //     wifi: { type: Boolean, default: false },
  //     parking: { type: Boolean, default: false },
  //     pool: { type: Boolean, default: false },
  //     restaurant: { type: Boolean, default: false },
  //     gym: { type: Boolean, default: false },

  //   },

  //   RoomFeatures: {
  //     privateBathroom: { type: Boolean, default: false },
  //     airConditioning: { type: Boolean, default: false },
  //     kitchen: { type: Boolean, default: false },
  //     flatScreenTV: { type: Boolean, default: false },
  //     familyRooms: { type: Boolean, default: false },
  //     washingMachine: { type: Boolean, default: false },
  //     sofa: { type: Boolean, default: false },
  //     desk: { type: Boolean, default: false },
  //     wardrobe: { type: Boolean, default: false },
  //     alarmClock: { type: Boolean, default: false },
  //     socketNearBed: { type: Boolean, default: false },
  //     sofaBed: { type: Boolean, default: false },
  //     clothesRack: { type: Boolean, default: false },
  //     dryingRack: { type: Boolean, default: false },
  //     tileMarbleFloor: { type: Boolean, default: false },
  //     privateEntrance: { type: Boolean, default: false },
  //     fan: { type: Boolean, default: false },
  //     iron: { type: Boolean, default: false },
  //     extraLongBeds: { type: Boolean, default: false },
  //     linens: { type: Boolean, default: false },
  //   },
  //   Bathroom: {
  //     shower: { type: Boolean, default: false },
  //     bath: { type: Boolean, default: false },
  //     bidet: { type: Boolean, default: false },
  //     hairdryer: { type: Boolean, default: false },
  //   },

  //   // Parking Options
  //   ParkingOptions: {
  //     privateParking: { type: Boolean, default: false },
  //     parkingGarage: { type: Boolean, default: false },
  //   },


  //   KitchenDining: {
  //     coffeemaker: { type: Boolean, default: false },
  //     oven: { type: Boolean, default: false },
  //     microwave: { type: Boolean, default: false },
  //     refrigerator: { type: Boolean, default: false },
  //     highChair: { type: Boolean, default: false },
  //     diningTable: { type: Boolean, default: false },
  //     toaster: { type: Boolean, default: false },
  //     stovetop: { type: Boolean, default: false },
  //     kitchenware: { type: Boolean, default: false },
  //     electricKettle: { type: Boolean, default: false },
  //     dishwasher: { type: Boolean, default: false },
  //   },


  //   // Outdoor & Recreation
  //   OutdoorRecreation: {
  //     picnicArea: { type: Boolean, default: false },
  //     beachfront: { type: Boolean, default: false },
  //     garden: { type: Boolean, default: false },
  //     outdoorPool: { type: Boolean, default: false },
  //     poolView: { type: Boolean, default: false },
  //     beachChairs: { type: Boolean, default: false },
  //     outdoorFurniture: { type: Boolean, default: false },
  //     sunTerrace: { type: Boolean, default: false },
  //     balcony: { type: Boolean, default: false },
  //     patio: { type: Boolean, default: false },
  //     beachAccess: { type: Boolean, default: false },

  //   },

  //   // Activities & Entertainment
  //   ActivitiesEntertainment: {
  //     gamesRoom: { type: Boolean, default: false },
  //     liveMusic: { type: Boolean, default: false },
  //     bikeTours: { type: Boolean, default: false },
  //     walkingTours: { type: Boolean, default: false },
  //     horseRiding: { type: Boolean, default: false },
  //     cycling: { type: Boolean, default: false },
  //     hiking: { type: Boolean, default: false },
  //     windsurfing: { type: Boolean, default: false },
  //     tennis: { type: Boolean, default: false },
  //     billiards: { type: Boolean, default: false },
  //   },

  //   HotelServices: {
  //     conciergeService: { type: Boolean, default: false },
  //     currencyExchange: { type: Boolean, default: false },
  //     frontDesk24h: { type: Boolean, default: false },
  //     ironingService: { type: Boolean, default: false },
  //     housekeeping: { type: Boolean, default: false },
  //     drycleaning: { type: Boolean, default: false },
  //     laundry: { type: Boolean, default: false },
  //     airportShuttle: { type: Boolean, default: false },
  //     invoiceProvided: { type: Boolean, default: false },
  //     expressCheckInOut: { type: Boolean, default: false },

  //   },

  //   BuildingFacilities: {
  //     elevator: { type: Boolean, default: false },
  //     minimarket: { type: Boolean, default: false },
  //     beautyShop: { type: Boolean, default: false },
  //     smokingArea: { type: Boolean, default: false },
  //     soundproofRooms: { type: Boolean, default: false },
  //     meetingFacilities: { type: Boolean, default: false },
  //     sharedLounge: { type: Boolean, default: false },

  //   },

  //   // Safety &Security
  //   SafetySecurity: {
  //     fireExtinguishers: { type: Boolean, default: false },
  //     security24h: { type: Boolean, default: false },
  //     keyCardAccess: { type: Boolean, default: false },
  //     cctvOutside: { type: Boolean, default: false },
  //     cctvCommonAreas: { type: Boolean, default: false },
  //     securityAlarm: { type: Boolean, default: false },
  //     smokeFree: { type: Boolean, default: false },
  //   },
  //   // Wellness
  //   Wellness: {
  //     spa: { type: Boolean, default: false },
  //     steamRoom: { type: Boolean, default: false },
  //     bodyTreatments: { type: Boolean, default: false },
  //     beautyServices: { type: Boolean, default: false },
  //     hammam: { type: Boolean, default: false }
  //   }

  // },

  // Policies
  
  policies: {
    pets: {
      allowed: { type: Boolean },
    },
    smoking: {
      allowed: { type: Boolean },
    },
    events: {
      allowed: { type: Boolean },
    },
    quietHours: {
      enforced: { type: Boolean },
      from: {
        type: String,
        required: function () {
          return this.policies.quietHours.enforced;
        }
      },
      to: {
        type: String,
        required: function () {
          return this.policies.quietHours.enforced;
        }
      }
    },
    checkIn: {
      from: String,
      to: String,
    },
    checkOut: {
      from: String,
      to: String,
    },
  },

  // Languages
  languages: [{
    type: String,
    enum: [
      "Arabic",
      "English",
      "French",
      "Spanish",
      "German",
      "Italian",
      "Chinese",
      "Japanese",
      "Russian",
      "Turkish",
      "Hindi",
      "Portuguese",
      "Korean",
      "Dutch"
    ],
  }],

  // Media
  photos: {
    type: [String],
    default: [],
  },

  // Rooms hotel
  hotelRooms: {
    type: [String],
    default: [],
  },
 
  // Room properties
  rooms: [{
    roomType: { type: String, enum: ["bedroom", "bathroom", "living room", "kitchen"], required: true },
    size: { type: Number }, // Square meters
    bedCount: { type: Number }, // If bedroom
    hasBalcony: { type: Boolean, default: false },
    hasPrivateBathroom: { type: Boolean, default: false },
  }],

  status: {
    type: String,
    default: "maintenance"
  },
// 


  featured: {
    type: Boolean,
    default: false,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
hotelSchema.index({ 'basicInfo.city': 1, 'basicInfo.type': 1 });
hotelSchema.index({ basePrice: 1 });
hotelSchema.index({ 'rental.durationType': 1 });
hotelSchema.index({ featured: 1 });
hotelSchema.index({ 'amenities.parking': 1 });

// Check if the model already exists
const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);
export default Hotel;
