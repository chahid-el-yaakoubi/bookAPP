import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

// Rate limiting implementation
const loginAttempts = new Map();
const lastAttemptTime = new Map();

const checkLoginAttempts = async (username) => {
  return loginAttempts.get(username) || 0;
};

const incrementLoginAttempts = async (username) => {
  const attempts = loginAttempts.get(username) || 0;
  loginAttempts.set(username, attempts + 1);
  lastAttemptTime.set(username, Date.now());
  
  // Clear attempts after 1 hour
  setTimeout(() => {
    loginAttempts.delete(username);
    lastAttemptTime.delete(username);
  }, 60 * 60 * 1000);
};

const resetLoginAttempts = async (username) => {
  loginAttempts.delete(username);
  lastAttemptTime.delete(username);
};

const getWaitTime = (username) => {
  const lastAttempt = lastAttemptTime.get(username);
  if (!lastAttempt) return 0;
  
  const attempts = loginAttempts.get(username) || 0;
  const timeSinceLastAttempt = Date.now() - lastAttempt;
  
  // Progressive waiting time based on failed attempts
  const waitTimes = {
    1: 2000,  // 2 seconds after 1st failed attempt
    2: 5000,  // 5 seconds after 2nd failed attempt
    3: 10000, // 10 seconds after 3rd failed attempt
    4: 20000, // 20 seconds after 4th failed attempt
    5: 30000  // 30 seconds after 5th failed attempt
  };
  
  const requiredWaitTime = waitTimes[attempts] || 0;
  const remainingWaitTime = Math.max(0, requiredWaitTime - timeSinceLastAttempt);
  
  return remainingWaitTime;
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password, fullName, isVerified, isAdmin, adminCars, adminHotels, adminHouses, adminShops, adminUsers } = req.body;

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
      isAdmin ,
      adminCars,
      adminHotels,
      adminHouses,
      adminShops,
      adminUsers,
      email,
      password: hashPass,
      isVerified: isVerified || true, // No verification process needed

    });

    await newUser.save();

    

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

    // Input validation
    if (!username || !password) {
      return next(createError(400, "Username and password are required"));
    }

    // Check waiting time
    // const waitTime = getWaitTime(username);
    // if (waitTime > 0) {
    //   return next(createError(429, `Please wait ${Math.ceil(waitTime/1000)} seconds before trying again`));
    // }

    // Rate limiting check
    // const loginAttempts = await checkLoginAttempts(username);
    // if (loginAttempts > 5) {
    //   return next(createError(429, "Too many login attempts. Please try again later"));
    // }

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });
    
    // if (!user) {
    //   await incrementLoginAttempts(username);
    //   return next(createError(401, "Incorrect username or password!"));
    // }

    // Check if account is locked
    // if (user.isLocked && user.lockUntil > Date.now()) {
    //   return next(createError(403, "Account is temporarily locked. Please try again later"));
    // }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // await incrementLoginAttempts(username);
      // if (loginAttempts >= 4) {
      //   // Lock account for 30 minutes after 5 failed attempts
      //   user.isLocked = true;
      //   user.lockUntil = Date.now() + 30 * 60 * 1000;
      //   await user.save();
      // }
      return next(createError(401, "Incorrect username or password!"));
    }

    // Reset login attempts on successful login
    // await resetLoginAttempts(username);
    // if (user.isLocked) {
    //   user.isLocked = false;
    //   user.lockUntil = undefined;
    //   await user.save();
    // }

    const {
      password: _,
      email,
      adminCars,
      adminHotels,
      adminHouses,
      adminShops,
      adminUsers,
      _id
    } = user;

    // Create roles object with only true values
    const roles = {};
    if (adminCars) roles.cars = true;
    if (adminHotels) roles.hotels = true;
    if (adminHouses) roles.houses = true;
    if (adminShops) roles.shops = true;
    if (adminUsers) roles.users = true;

    const isAnyAdmin = Object.keys(roles).length > 0;
    const isFullAdmin = Object.keys(roles).length === 5;

    const expiresIn = !isAnyAdmin ? undefined : isFullAdmin ? "30d" : "6h";
    const cookieMaxAge = !isAnyAdmin ? undefined : isFullAdmin ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 6;

    const token = jwt.sign(
      { id: _id, email, isAdmin: isAnyAdmin , adminFull : roles.users},
      process.env.JWT_SECRET,
      expiresIn ? { expiresIn } : undefined
    );

    const responseData = {
      message: "Login successful",
      token,
      user: {
        id: _id,
        email,
        ...(isAnyAdmin && {
          isAdmin: true,
          roles
        })
      },
    };

    res.status(200).json(responseData);

  } catch (err) {
    console.error("Login Error:", err);
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
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.verificationCode !== code) {
      console.log({ code, newPassword, email })
      console.log(user.verificationCode)

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