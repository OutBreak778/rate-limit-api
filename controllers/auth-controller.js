import mongoose from "mongoose"
import { User } from "../models/user-model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const SignUp = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {name, email, password, role} = req.body
        
        // Validate required fields
        if(!name || !email || !password) {
            const error = new Error("All fields are required")
            error.statusCode = 401
            throw error
        }

        // Check if user already exists
        const existingUser = await User.findOne({email: email})
        if(existingUser) {
            const error = new Error("User Already Exists")
            error.statusCode = 400
            throw error
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create user - if role is provided and is admin, set as admin, otherwise default to user
        const userRole = role === "admin" ? "admin" : "user"
        
        const user = await User.create([{
            name,
            email,
            password: hashedPassword,
            role: userRole
        }], {session})

        if(!user || !user[0]) {
            const error = new Error("Something went wrong, Please try again!")
            error.statusCode = 400
            throw error
        }

        // Generate token with role information
        const token = jwt.sign(
            {
                userId: user[0]._id,
                email: user[0].email,
                role: user[0].role
            }, 
            process.env.SECRET_KEY, 
            {
                expiresIn: process.env.JWT_EXPIRY || '7d'
            }
        )

        await session.commitTransaction()
        session.endSession()

        // Remove password from response
        const userResponse = user[0].toObject()
        delete userResponse.password

        res.status(201).json({
            success: true,
            token,
            data: userResponse
        })
        
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

export const SignIn = async (req, res, next) => {
    try {
        const {email, password} = req.body
        
        // Validate required fields
        if(!email || !password) {
            const error = new Error("All fields are required")
            error.statusCode = 401
            throw error
        }
        
        // Find user by email
        const user = await User.findOne({email})
        if(!user) {
            const error = new Error("Invalid credentials")
            error.statusCode = 401
            throw error
        }

        // Check if account is active
        if(!user.isActive) {
            const error = new Error("Account is deactivated. Please contact admin")
            error.statusCode = 403
            throw error
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) {
            const error = new Error("Invalid credentials")
            error.statusCode = 401
            throw error
        }

        // Generate token with role information
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            }, 
            process.env.SECRET_KEY, 
            {
                expiresIn: process.env.JWT_EXPIRY || '7d'
            }
        )

        // Remove password from response
        const userResponse = user.toObject()
        delete userResponse.token
        delete userResponse.password

        // Set cookie for web clients
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        return res.status(200).json({
            success: true,
            token,
            data: userResponse
        })
        
    } catch (error) {
        next(error)
    }
}

export const SignOut = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })
        
        res.status(200).json({
            success: true, 
            message: "User signed out successfully"
        })
    } catch (error) {
        next(error)
    }
}
