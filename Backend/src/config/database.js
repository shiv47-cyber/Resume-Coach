const mongoose = require("mongoose")

let connectionPromise

async function connectToDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose
    }

    if (connectionPromise) {
        return connectionPromise
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured.")
    }

    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
    })
        .then((connection) => {
            console.log("Connected to MongoDB.")
            return connection
        })
        .catch((error) => {
            connectionPromise = null
            throw error
        })

    return connectionPromise
}

module.exports = connectToDB