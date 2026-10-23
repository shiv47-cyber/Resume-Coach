const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
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


//  require all the routes here
const authRouter = require("./routes/auth.routes");app.use("/api/auth",authRouter)
const interviewRouter= require("./routes/interview.routes");app.use("/api/interview", interviewRouter)

// using all the routes here 
module.exports=app