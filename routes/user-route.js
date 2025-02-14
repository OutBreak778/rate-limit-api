import express from 'express'
import { getUser, getUsers } from '../controllers/user-controller.js'
import { authorized } from "../middlewares/auth.js"

const userRouter = express.Router()

userRouter.get("/", getUsers)
userRouter.get("/:id", authorized, getUser)
userRouter.post("/", (req, res) => res.send({message: "POST create user details"}))
userRouter.put("/:id", (req, res) => res.send({message: "UPDATE user details"}))
userRouter.delete("/:id", (req, res) => res.send({message: "DELETE user details"}))

export default userRouter