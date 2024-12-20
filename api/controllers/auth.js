import User from '../models/user.js'
import bcrypt from 'bcryptjs';
import { createError } from '../utils/error.js';
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            ...req.body,
            password: hashPass
        });

        await newUser.save();
        res.status(200).send('user created successfully!')
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(401, "User not found!"));

        const isPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isPassword) return next(createError(401, "Incorrect username or password!"));
        
        const {isAdmin, password, ...otherDetail} = user._doc
        const token = jwt.sign({ id: user._id, isAdmin : user.isAdmin }, process.env.JWT_SECRET);
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json({details:{...otherDetail}, isAdmin});
    } catch (err) {
        next(err);
    }
};
