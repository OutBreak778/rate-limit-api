import express from "express"
import authRouter from "./routes/auth-route.js"
import dotenv from "dotenv"
import userRouter from "./routes/user-route.js"
import cookieParser from "cookie-parser"
import { errorMiddleware } from "./middlewares/error.js"
import taskRouter from "./routes/task-route.js"
import cors from "cors"

const app = express()
dotenv.config({
    path: '.env'
})

const allowedOrigins = [
  "http://localhost:5173",
  process.env.PRODUCTION_URL
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)

    // Allow exact matches
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    // Allow any Vercel preview subdomain
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true)
    }

    callback(new Error("Not allowed by CORS"))
  },
  credentials: true
}))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

app.use(errorMiddleware)

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/task", taskRouter)

export default app