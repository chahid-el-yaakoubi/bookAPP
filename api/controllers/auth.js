import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body;

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
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return next(createError(401, "User not found!"));

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return next(createError(401, "Incorrect username or password!"));

    // Check if user is verified
    if (!user.isVerified) {
      return next(createError(403, "Please verify your email before logging in"));
    }

    const {
      password: _,
      email,
      adminCars,
      adminHotes,
      adminHouses,
      adminShops,
      adminUsers,
      _id
    } = user;

    const roles = { cars: adminCars, hotels: adminHotes, houses: adminHouses, shops: adminShops, users: adminUsers };
    const isAnyAdmin = Object.values(roles).some(Boolean);
    const isFullAdmin = Object.values(roles).every(Boolean);

    // Set token expiration based on admin status
    // Admin tokens expire in 6 hours, regular user tokens don't expire
    const expiresIn = isAnyAdmin ? "6h" : "365d"; // 1 year for regular users
    
    // Create token with proper expiration
    const token = jwt.sign(
      { 
        id: _id, 
        email, 
        isAdmin: isAnyAdmin,
        roles: isAnyAdmin ? roles : undefined,
        exp: isAnyAdmin ? Math.floor(Date.now() / 1000) + (60 * 60 * 6) : undefined // 6 hours for admins
      },
      process.env.JWT_SECRET
    );

    // Calculate token expiry time for client-side reference
    const expiryTime = isAnyAdmin ? new Date(Date.now() + 1000 * 60 * 60 * 6).getTime() : null;

    res.status(200).json({
      message: "Login successful",
      token,
      tokenExpiry: expiryTime, // Send expiry timestamp to client
      user: {
        id: _id,
        email,
        username: user.username,
        fullName: user.fullName,
        isAdmin: isAnyAdmin,
        roles,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    // Verify the existing token
    const { token } = req.body;
    
    if (!token) {
      return next(createError(401, "No token provided"));
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(createError(403, "Invalid or expired token"));
    }
    
    // Find the user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    // Check if this is an admin token that needs refreshing
    const roles = { 
      cars: user.adminCars, 
      hotels: user.adminHotes, 
      houses: user.adminHouses, 
      shops: user.adminShops, 
      users: user.adminUsers 
    };
    const isAnyAdmin = Object.values(roles).some(Boolean);
    
    // Generate a new token
    const newToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        isAdmin: isAnyAdmin,
        roles: isAnyAdmin ? roles : undefined,
        exp: isAnyAdmin ? Math.floor(Date.now() / 1000) + (60 * 60 * 6) : undefined // 6 hours for admins
      },
      process.env.JWT_SECRET
    );
    
    // Calculate token expiry time for client
    const expiryTime = isAnyAdmin ? new Date(Date.now() + 1000 * 60 * 60 * 6).getTime() : null;
    
    res.status(200).json({
      message: "Token refreshed successfully",
      token: newToken,
      tokenExpiry: expiryTime,
    });
    
  } catch (err) {
    console.error("Token Refresh Error:", err);
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

    // Create admin token with 6-hour expiration
    const token = jwt.sign(
      { 
        id: user._id, 
        isAdmin: true,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 6) // 6 hours
      }, 
      process.env.JWT_SECRET
    );

    res.status(200).json({ 
      message: "Admin verified successfully",
      token,
      tokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 6).getTime()
    });
  } catch (err) {
    next(err);
  }
};

export const verifyUserCode = async (req, res, next) => {
  try {
    const { code, newPassword, email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
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