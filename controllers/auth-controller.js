import mongoose from "mongoose"
import { User } from "../models/user-model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const SignUp = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {name, email, password} = req.body
        if(!name || !email || !password) {
            const error = new Error("All fields are required")
            error.statusCode = 401
            throw error
        }

        const existingUser = await User.findOne({email: email})
        if(existingUser) {
            const error = new Error("User Already Exists")
            error.statusCode = 400
            throw error
        }

        const salt = await bcrypt.genSalt(15)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create([{
            name,
            email,
            password: hashedPassword
        }], {session})

        if(!user) {
            const error = new Error("Something went wrong, Please try again!")
            error.statusCode = 400
            throw error
        }

        const token = jwt.sign({userId: user[0]._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRY
        })

        await session.commitTransaction()
        session.endSession()

        res.status(201).json({
            token,
            data: user[0]
        })
        next()
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}
export const SignIn = async (req, res, next) => {
    try {

        const {email, password} = req.body
        if(!email || !password) {
            const error = new Error("All fields are required")
            error.statusCode = 401
            throw error
        }
        
        const user = await User.findOne({email})
        if(!user) {
            const error = new Error("User not found!")
            error.statusCode = 401
            throw error
        }

        const validPassword = await bcrypt.compare(password,user.password)
        if(!validPassword) {
            const error = new Error("Something went wrong, please try again!")
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRY
        })

        return res.status(201).json({
            token,
            data: user
        })
        
    } catch (error) {
        next(error)
    }

}
export const SignOut = async (req, res, next) => {
    try {
        res.clearCookie("token")
        res.status(201).json({success: true, data: "User Sign-out successfully"})
    } catch (error) {
        next(error)
    }
    
}