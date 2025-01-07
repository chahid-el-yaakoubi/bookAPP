import mongoose from "mongoose";


const roomSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    maxPeople: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true,
    },
    area: {type: Number, required: true},
    roomNumber: [{
        number: Number,
        unavailableDates: { type: [Date] }
    }],
    amenities: [{type: String}],

}, { timestamps: true });


export default mongoose.model('Room', roomSchema);


