import jwt from "jsonwebtoken";
import { User } from "../models/user-model.js";

export const authorized = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(500).json({message: "Unauthorized Access"})
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error("Something went wrong, please try again!");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error"})
  }
};

// Simple middleware to check if user is admin
export const isAdmin = (req, res, next) => {
    try {
        // Get token from header or cookie
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.token
        
        if(!token) {
            const error = new Error("Access denied. No token provided.")
            error.statusCode = 401
            throw error
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        
        if(decoded.role !== "admin") {
            const error = new Error("Access denied. Admin privileges required.")
            error.statusCode = 403
            throw error
        }

        req.user = decoded
        next()
    } catch (error) {
        if(error.name === "JsonWebTokenError") {
            error.message = "Invalid token"
            error.statusCode = 401
        }
        if(error.name === "TokenExpiredError") {
            error.message = "Token expired"
            error.statusCode = 401
        }
        next(error)
    }
}

// Middleware to check if user is authenticated
export const isAuthenticated = async (req, res, next) => {
    try {
        // Get token from header or cookie
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (!token) {
            const error = new Error("Authentication required");
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 401;
            throw error;
        }

        // ✅ Set both the full user object AND individual properties
        req.user = user;                    // Full Mongoose document
        req.userId = user._id.toString();   // String ID
        req.user._id = user._id;            // ObjectId
        req.user.userId = user._id.toString(); // String ID (what your code expects)
        req.user.role = user.role;

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            error.message = "Invalid token";
            error.statusCode = 401;
        }
        if (error.name === "TokenExpiredError") {
            error.message = "Token expired";
            error.statusCode = 401;
        }
        next(error);
    }
};