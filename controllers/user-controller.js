import { User } from "../models/user-model.js"

export const getUsers = async (req, res, next) => {
    try {
        const user = await User.find()
        res.status(201).json({success: true, data: user})
    } catch (error) {
        next(error)
    }
}
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password")

        if(!user) {
            const error = new Error("User not found")
            error.statusCode = 400
            throw error
        }
        res.status(201).json({success: true, data: user})
    } catch (error) {
        next(error)
    }
}

export const createUser = async (req, res, next) => {
    try {
        const {name, email, gender, age, location} = req.body
        const user = await User.create({
            name,
            email,
            gender,
            age,
            location
        })
        res.status(201).json({success: true, data: user})
    } catch (error) {
        next(error)
    }
}