import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    // Check the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ success: false, message: "not authorized" });
    }

    try {
        // Extract the TOKEN from "Bearer TOKEN"
        const token = authHeader.split(' ')[1];
        
        // use jwt.verify() instead of decode()
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.id) {
            return res.json({ success: false, message: "not authorized" });
        }
        
        // Get the User from the database
        req.user = await User.findById(decoded.id).select("-password");
        
        if (!req.user) {
            return res.json({ success: false, message: "user not found" });
        }
        
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        return res.json({ success: false, message: "not authorized" });
    }
}

