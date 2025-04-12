import User from '../models/user.js';
import bcrypt from 'bcryptjs';

// export const creatUser = async (req, res, next) => {
//     const newUser = new User(req.body);
//     try {
//         const saveUser = await newUser.save();
//         res.status(200).json(saveUser);
//     } catch (err) {
//        next(err);
//     }
// }

export const updateUser = async (req, res, next) => {
    try {
        // If password is included in the request, hash it
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const updateUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );
        
        res.status(200).json(updateUser);
    } catch (err) {
        next(err);
    }
}
 


export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.");
    } catch (err) {
       next(err);
    }
}


export const getUser = async (req, res, next) => {
    try {
        const user= await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
       next(err);
    }
}



export const getUsers = async (req, res, next) => {
    try {
        const users= await User.find();
        res.status(200).json(users);
    } catch (err) {
       next(err);
    }
}


export const countByUser = async (req, res, next) => {
    try {
    const userCount = await User.countDocuments({});
        res.status(200).json(userCount);
    } catch (err) {
        next(err);
    }
}


// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js"; // your email sender function

export const requestPasswordUpdate = async (req, res, next) => {
  const { userId, currentPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    await sendEmail(
      user.email,
      'Verify Your Password Change',
      `Your verification code is: ${verificationCode}\nIt expires in 10 minutes.`
    );

    res.status(200).json({ message: 'Verification code sent to email' });
  } catch (err) {
    next(err);
  }
};


 
export const verifyUserEmail = async (req, res, next) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // Generate a new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Set expiration time (10 minutes from now)
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
        
        // Save changes
          await user.save();

        
        // Send email with the new verification code
        await sendEmail(
            user.email,
            'Your Verification Code',
            `Your verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`
        );
        
        res.status(200).json({
            message: 'Verification code sent to your email.'
        });
    } catch (err) {
        next(err);
    }
};

export const verifyUserCode = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { code, newPassword } = req.body;
        
        // Find the user by ID
        const user = await User.findById(userId);
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


export const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        // Check if the oldPassword is provided and verify it
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Both old and new passwords are required" });
        }
        
        // Find the user by ID
        const user = await User.findById(req.params.id);
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Compare the old password with the stored password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        
        // If the new password is provided, hash it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update the user's password
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { password: hashedPassword } },
            { new: true }
        );
        
        res.status(200).json(updateUser);
    } catch (err) {
        next(err);
    }
};

export const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email.' });
        }
        
        // Generate a new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Set expiration time (10 minutes from now)
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
        
        // Save changes
        await user.save();
        
        // Send email with the new verification code
        await sendEmail(
            user.email,
            'Password Reset Code',
            `Your password reset code is: ${verificationCode}\nThis code will expire in 10 minutes.`
        );
        
        res.status(200).json({
            message: 'Password reset code sent to your email.'
        });
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { email, verificationCode, newPassword } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email.' });
        }
        
        // Check if code matches and is not expired
        if (
            user.verificationCode !== verificationCode ||
            !user.verificationCodeExpires ||
            user.verificationCodeExpires < Date.now()
        ) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update user password and clear verification code
        user.password = hashedPassword;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();
        
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        next(err);
    }
};