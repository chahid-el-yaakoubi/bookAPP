import mongoose from "mongoose";

const CitySchema = new mongoose.Schema({
    isA: { type: String, required: true },
    region: {
        type: String,
        required: true,
        enum: [
            "Tanger-Tétouan-Al Hoceïma",
            "L'Oriental",
            "Fès-Meknès",
            "Rabat-Salé-Kénitra",
            "Béni Mellal-Khénifra",
            "Casablanca-Settat",
            "Marrakech-Safi",
            "Drâa-Tafilalet",
            "Souss-Massa",
            "Guelmim-Oued Noun",
            "Laâyoune-Sakia El Hamra",
            "Dakhla-Oued Ed-Dahab"
        ],
        index: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    neighbors: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const City = mongoose.model("City", CitySchema);

export default City;