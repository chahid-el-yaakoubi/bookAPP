import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    // const token = req.cookies.access_token;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    if (!token) {
        return next(createError(401, "No token provided"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return next(createError(401, "Session expired. Please login again."));
            }
            return next(createError(403, "Invalid token"));
        }

        // Check if token is about to expire (within 5 minutes)
        const tokenExpiration = user.exp * 1000; // Convert to milliseconds
        const timeUntilExpiration = tokenExpiration - Date.now();
        
        if (timeUntilExpiration < 5 * 60 * 1000) { // Less than 5 minutes
            // Create new token
            const newToken = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    isAdmin: user.isAdmin 
                },
                process.env.JWT_SECRET,
                { expiresIn: user.isAdmin ? '30d' : '6h' }
            );
            
            // Add new token to response headers
            res.setHeader('X-New-Token', newToken);
        }

        req.user = user;
        next();
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "You are not authorized to perform this action."));
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        if (req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "You are not authorized to perform this action."));
        }
    });
};

export const checkSession = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(200).json({ isAuthenticated: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(200).json({ isAuthenticated: false });
        }

        // Check if token is about to expire
        const tokenExpiration = user.exp * 1000;
        const timeUntilExpiration = tokenExpiration - Date.now();
        
        if (timeUntilExpiration < 5 * 60 * 1000) {
            const newToken = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    isAdmin: user.isAdmin 
                },
                process.env.JWT_SECRET,
                { expiresIn: user.isAdmin ? '30d' : '6h' }
            );
            
            res.setHeader('X-New-Token', newToken);
        }

        return res.status(200).json({
            isAuthenticated: true,
            user: {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    });
};
