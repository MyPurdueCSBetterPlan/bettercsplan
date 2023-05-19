/*
 * Index.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
require("dotenv").config()
const cookieParser = require("cookie-parser")
const authRoute = require("./Routes/AuthRoute")
const createRoute = require("./Routes/CreateRoute")
const homeRoute = require("./Routes/HomeRoute")
const { MONGO_URL, PORT } = process.env

//attempts to connect to MongoDB Atlas
mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB is  connected successfully"))
    .catch((err) => console.error(err))

//listens to requests on given port
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

//enables CORS (lets requests from origin access data on the server)
app.use(
    cors({
        origin: [`http://localhost:3000`],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)

//parses cookies from requests into an object and makes them available in req.cookies
app.use(cookieParser())

//parses json data from request body and makes it available in req.body
app.use(express.json())

//requests enabled for authentication routes
app.use("/", authRoute)

//requests enabled for create routes
app.use("/", createRoute)

app.use("/", homeRoute)