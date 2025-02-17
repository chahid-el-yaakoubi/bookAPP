import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

export const register = async (req, res, next) => {
    try {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hashPass,
            verificationCode,
            verificationCodeExpires,
            isVerified: false,
        });

        await newUser.save();

        if (!newUser.isVerified) {
            await sendEmail(
                req.body.email,
                'Your Verification Code',
                `Your verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`
            );
        }

        res.status(200).json({
            message: 'User created. Please check your email for verification code.',
            userId: newUser._id
        });
    } catch (err) {
        next(err);
    }
};

export const verify = async (req, res, next) => {
    try {
        const { iduser, code } = req.body;
        const user = await User.findOne({ _id: iduser });

        if (!user) return next(createError(404, "User not found!"));
        if (user.isVerified) return next(createError(400, "Email is already verified"));
        if (!user.verificationCode) return next(createError(400, "No verification code found"));
        if (user.verificationCode !== code) return next(createError(400, "Invalid verification code"));
        if (user.verificationCodeExpires < Date.now()) return next(createError(400, "Verification code has expired"));

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(401, "User not found!"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(401, "Incorrect username or password!"));

        const { isAdmin, password, ...otherDetails } = user._doc;

        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
            secure: process.env.NODE_ENV === "production", // Secure flag for HTTPS
            sameSite: 'None',
        })
        .status(200)
        .json({ message: "Login successful", details: { ...otherDetails }, isAdmin });
    } catch (err) {
        console.error(err); // Log the error for better debugging
        next(err);
    }
};

export const verifyAdmin = async (req, res, next) => {
    try {
        const { userId, code } = req.body;
        const user = await User.findOne({ _id: userId });

        if (!user) return next(createError(404, "User not found!"));
        if (!user.isAdmin) return next(createError(403, "User is not an admin"));
        if (!user.verificationCode) return next(createError(400, "No verification code found"));
        if (user.verificationCode !== code) return next(createError(400, "Invalid verification code"));
        if (user.verificationCodeExpires < Date.now()) return next(createError(400, "Verification code has expired"));

        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        const { isAdmin, password, ...otherDetails } = user._doc;
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);

        res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: 'None',
            maxAge: 60 * 60 * 1000, // 1 hour
            secure: process.env.NODE_ENV === "production", // Secure flag for HTTPS
        }).status(200).json({ details: { ...otherDetails }, isAdmin });
    } catch (err) {
        next(err);
    }
};
