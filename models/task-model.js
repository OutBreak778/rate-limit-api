import mongoose from "mongoose"

const Schema = mongoose.Schema

const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true,
        minLen: 3,
        maxLen: 100
    },
    description: {
        type: String,
        trim: true,
        maxLen: 500
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    dueDate: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

taskSchema.index({ user: 1, status: 1 })
taskSchema.index({ dueDate: 1 })

export const Task = mongoose.model("Task", taskSchema)