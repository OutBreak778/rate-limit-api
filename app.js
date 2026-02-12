import express from "express"
import authRouter from "./routes/auth-route.js"
import dotenv from "dotenv"
import userRouter from "./routes/user-route.js"
import subscriptionRouter from "./routes/subscription-route.js"
import cookieParser from "cookie-parser"
import { errorMiddleware } from "./middlewares/error.js"
import taskRouter from "./routes/task-route.js"
import cors from "cors"

const app = express()
dotenv.config({
    path: '.env'
})
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

app.use(errorMiddleware)

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/task", taskRouter)

export default app