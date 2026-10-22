require("dotenv").config({ path: require("node:path").resolve(__dirname, ".env") })
const app = require("./app")
const connectToDB = require("./config/database") 



connectToDB()


app.listen(3000,()=>{
    console.log("server is running on port http://localhost:3000")
})