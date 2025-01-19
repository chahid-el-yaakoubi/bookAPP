import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info to request object
        next(); // Proceed to the next middleware or route
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
