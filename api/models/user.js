import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    city: String,
    phone: String,
    img: String,
    isVerified: {
        type: Boolean,
        default: false,
      },
      verificationCode: String,
      verificationCodeExpires: Date,
}, { timestamps: true });


export default mongoose.model('User', UserSchema);







