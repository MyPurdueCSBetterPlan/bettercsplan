const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");
const {TOKEN_KEY} = process.env
const jwt = require("jsonwebtoken")

//called when post request is sent to "/signup"
module.exports.Signup = async (req, res) => {
    try {
        const {username, password} = req.body
        const existingUser = await User.findOne({username: username})

        if (existingUser !== null) {
            return res.json({ message: "User already exists" })
        }

        const user = await User.create({ username, password })
        const token = createSecretToken(user._id)

        //sends secret token value as part of the cookie header to the client
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        })

        res.status(201).json({ message: "User signed in successfully", success: true, user })
    } catch (error) {
        console.error(error)
    }
}

//called when post request is sent to "/login"
module.exports.Login = async (req, res) => {
    try {
        const { username, password } = req.body

        if(username === null || password === null){
            return res.json({message:'All fields are required'})
        }

        const user = await User.findOne({username: username })
        if(user === null){
            return res.json({message:'Incorrect password or username'})
        }

        //compares password given by client and decrypted password stored in MongoDB
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.json({message:'Incorrect password or email'})
        }

        //sends secret token value as part of the cookie header to the client
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({message: "User logged in successfully", success: true})
    } catch (error) {
        console.error(error)
    }
}

