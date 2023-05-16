const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

module.exports.Signup = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.json({ message: "User already exists" })
        }
        const user = await User.create({ username, password })
        const token = createSecretToken(user._id)
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        })
        res
            .status(201)
            .json({ message: "User signed in successfully", success: true, user })
        next()
    } catch (error) {
        console.error(error)
    }
}

module.exports.Login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        if(username === null || password === null){
            return res.json({message:'All fields are required'})
        }
        const user = await User.findOne({ username })
        if(user === null){
            return res.json({message:'Incorrect password or username'})
        }
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.json({message:'Incorrect password or email'})
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({message: "User logged in successfully", success: true})
        next()
    } catch (error) {
        console.error(error)
    }
}