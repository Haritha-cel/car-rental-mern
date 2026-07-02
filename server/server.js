import express from "express";
import "dotenv/config";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express()

// Connect Database
await connectDB()

//Middleware
app.use(cors());
app.use(express.json());

// ✅ General API Limiter (100 requests per 15 minutes)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, 
    message: 'Too many requests from this IP, please try again later.'
})

// ✅ Strict Auth Limiter (5 requests per 15 minutes to prevent brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login attempts, please try again after 15 minutes.'
})

// Apply general limiter to all API routes
app.use('/api/', generalLimiter)

// Apply strict limiter ONLY to auth routes
app.use('/api/user/login', authLimiter)
app.use('/api/user/register', authLimiter)

app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))