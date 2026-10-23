require("dotenv").config({ path: require("node:path").resolve(__dirname, ".env") })
const app = require("./app")
const connectToDB = require("./config/database")

const port = process.env.PORT || 3000

connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}.`)
        })
    })
    .catch((error) => {
        console.error("Could not start the server because MongoDB is unavailable:", error.message)
        process.exitCode = 1
    })