import mongoose from "mongoose";

// bathroom
const BathroomSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    amenities: {
      type: Map,
      of: Boolean,
      default: {}
    }
  });

// Room Schema

const roomSchema = new mongoose.Schema({
    type: String, // Example: "Luxury Suite"
    description: String,  
    price: Number, // Example: 150.00
    isAvailable: Boolean, // Example: true
    amenities: [String], // Example: ["WiFi", "Air Conditioning"]
    roomFeatures : [String], 
    view : [String],
    beds : [{
        type: { type: String,  }, 
        count: { type: Number,   }   
    }], 
    floor: Number, // Example:
    capacity: Number, 
    bathrooms: [BathroomSchema],

    size: { 
        value: Number, 
        unit: { type: String, enum: ["sq_m", "sq_ft"] } 
    }, // Example: { value: 50, unit: "sq_m" }
    photos: [{
      url: String
    }], // Example: ["WiFi", "Air Conditioning"]
    extraData: mongoose.Schema.Types.Mixed, // Any flexible data
    categorizedAmenities: { type: Map, of: [String] } // Example: { "Luxury": ["Jacuzzi", "Mini Bar"] }
}, {timestamps: true} );
  

export default mongoose.model('Room', roomSchema);
