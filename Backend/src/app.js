const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectToDB = require("./config/database")
const app = express()

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(async (req, res, next) => {
    try {
        await connectToDB()
        next()
    } catch (error) {
        console.error("MongoDB connection failed:", error.message)
        res.status(503).json({
            message: "The service is temporarily unavailable because the database could not be reached."
        })
    }
})

//  require all the routes here
const authRouter = require("./routes/auth.routes");app.use("/api/auth",authRouter)
const interviewRouter= require("./routes/interview.routes");app.use("/api/interview", interviewRouter)

// using all the routes here 
module.exports=app