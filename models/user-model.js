import mongoose from "mongoose"

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        minLen: 3,
        maxLen: 50,
        required: [true, "User Name is required"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "user Email is required"],
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "please enter a valid email"]
    },
    password: {
        type: String,
        unique: true,
        required: [true, "user Password is required"],
        trim: true,
        minLen: 3,
        maxLen: 10
    },
    age: {
        type: Number,
        trim: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"]
    },
    location: {
        type: String,
        minLen: 3,
        maxLen: 100
    }
}, {timestamps: true})

export const User = mongoose.model('user', userSchema)