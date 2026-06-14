/*
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message: "not authorized"})
    }
    try {
        const userId = jwt.decode(token, process.env.JWT_SECRET)

        if(!userId){
            return res.json({success: false, message: "not authorized"})
        }
        req.user = await User.findById(userId).select("-password")
        next();
    } catch (error) {
        return res.json({success: false, message: "not authorized"})
    }
}

*/

/*
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Get token part after "Bearer "
    const token = authHeader.split(" ")[1];

    // Verify token properly
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.id is your user id
    if (!decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Fetch user from DB
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    next(); // ✅ move to next middleware/controller
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ success: false, message: "Not authorized" });
  }
};


*/

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    // Authorization header එක check කරන්න
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ success: false, message: "not authorized" });
    }

    try {
        // "Bearer TOKEN" වලින් TOKEN එක extract කරන්න
        const token = authHeader.split(' ')[1];
        
        // jwt.verify() use කරන්න (decode() වෙනුවට)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.id) {
            return res.json({ success: false, message: "not authorized" });
        }
        
        // User එක database එකෙන් ගන්න
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

