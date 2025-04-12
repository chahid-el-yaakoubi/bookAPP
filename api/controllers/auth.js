import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
 
export const register = async (req, res, next) => {
    try {
            const { username, email, password,fullName  } = req.body;

        // Check if username exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if email exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashPass,
            isVerified: true, // No verification process needed
        });

        await newUser.save();

        // Send welcome email
        await sendEmail(
            email,
            'Welcome to Axistay 🎉',
            `Hello ${username},\n\nWelcome to Axistay! We're excited to have you with us.`
        );

        res.status(200).json({
            message: 'User registered successfully.',
            userId: newUser._id
        });
    } catch (err) {
        next(err);
    }
};




export const CheckUsername = async (req, res, next) => {
    try {
        const { username } = req.body;
        
        if (!username) {
          return res.status(400).json({
            success: false,
            message: 'Username is required',
            available: false
          });
        }
    
        // Validate username format
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
          return res.status(400).json({
            success: false,
            message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
            available: false
          });
        }
    
        // Check if username exists in the database
        const existingUser = await User.findOne({ username: username });
    
        if (existingUser) {
          return res.status(200).json({
            success: true,
            message: 'Username already taken',
            available: false
          });
        }
    
        // Username is available
        return res.status(200).json({
          success: true,
          message: 'Username is available',
          available: true
        });
      } catch (error) {
        console.error('Error checking username:', error);
        return res.status(500).json({
          success: false,
          message: 'Server error while checking username',
          available: false
        });
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

    const { password, ...otherDetails } = user._doc;

    // Determine admin flags
    const adminFields = [
      user.adminCars,
      user.adminHotes,
      user.adminHouses,
      user.adminShops,
      user.adminUsers,
    ];

    const adminCount = adminFields.filter(Boolean).length;
    const isFullAdmin = adminCount === adminFields.length;
    const isAnyAdmin = adminCount > 0;

    // Set token duration based on admin level
    let tokenExpiry;
    let cookieMaxAge;

    if (!isAnyAdmin) {
      tokenExpiry = undefined; // No expiration
      cookieMaxAge = undefined;
    } else if (isFullAdmin) {
      tokenExpiry = '30d';
      cookieMaxAge = 1000 * 60 * 60 * 24 * 30;
    } else {
      tokenExpiry = '6h';
      cookieMaxAge = 1000 * 60 * 60 * 6;
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: isAnyAdmin,
      },
      process.env.JWT_SECRET,
      tokenExpiry ? { expiresIn: tokenExpiry } : undefined
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: cookieMaxAge,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'None',
    })
    .status(200)
    .json({
      message: "Login successful",
      details: { ...otherDetails },
      isAdmin: isAnyAdmin,
    });

  } catch (err) {
    console.error(err);
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
            maxAge: 60 * 60 * 1000 * 10, // 10 hour
            secure: process.env.NODE_ENV === "production", // Secure flag for HTTPS
        }).status(200).json({ details: { ...otherDetails }, isAdmin });
    } catch (err) {
        next(err);
    }
};

export const verifyUserCode = async (req, res, next) => {
    try {
        const { code, newPassword, email } = req.body;

        
        // Find the user by ID
        const user = await User.findOne({email : email});
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        
        if(user.verificationCode !== code){
            console.log( { code, newPassword, email })
            console.log( user.verificationCode )

        }
        // Check if code matches and is not expired
        if (
            user.verificationCode !== code ||
            !user.verificationCodeExpires ||
            user.verificationCodeExpires < Date.now()
        ) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
        }
        
        // If newPassword is provided, update the password
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
        }
        
        // Mark user as verified and clear the code
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();
        
        res.status(200).json({ success: true, message: 'Password updated successfully.' });
    } catch (err) {
        next(err);
    }
};