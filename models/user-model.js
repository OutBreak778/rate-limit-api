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
        required: [true, "User Email is required"],
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "User Password is required"],
        trim: true,
        minLen: [3, "Password must be at least 6 characters long"],
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
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

userSchema.index({ role: 1 });

userSchema.methods.isAdmin = function() {
    return this.role === "admin";
};

export const User = mongoose.model('User', userSchema)