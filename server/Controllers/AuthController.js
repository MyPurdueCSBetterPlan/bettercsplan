
/*
 * AuthController.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const User = require("../Models/UserModel");
const {createSecretToken} = require("../util/SecretToken");
const bcrypt = require("bcrypt");
const {TOKEN_KEY} = process.env
const jwt = require("jsonwebtoken")

//called when post request is sent to "/signup"
module.exports.Signup = async (req, res, next) => {
    try {
        const {username, password} = req.body
        const existingUser = await User.findOne({username})

        if (existingUser !== null) {
            return res.json({message: "User already exists"})
        }

        const user = await User.create({username, password})
        const token = createSecretToken(user._id)

        //sends secret token value as part of the cookie header to the client
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        })

        res.status(201).json({message: "User signed in successfully", success: true, user})

        next()
    } catch (error) {
        console.error(error)
    }
}

//called when post request is sent to "/login"
module.exports.Login = async (req, res, next) => {
    try {
        const {username, password} = req.body

        if (username === null || password === null) {
            return res.json({message: 'All fields are required'})
        }

        const user = await User.findOne({username})
        if (user === null) {
            return res.json({message: 'Incorrect password or username'})
        }

        //compares password given by client and decrypted password stored in MongoDB
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.json({message: 'Incorrect password or email'})
        }

        //sends secret token value as part of the cookie header to the client
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

//called when post request is sent to "/"
module.exports.userVerification = (req, res) => {
    const token = req.cookies.token
    if (token === null) {
        return res.json({status: false})
    }

    //decrypts the secret token using the token key
    //gives false status when there is an error or the username is null, gives true status otherwise
    jwt.verify(token, TOKEN_KEY, async (err, decoded) => {
        if (err !== null) {
            return res.json({status: false})
        } else {
            const user = await User.findById(decoded.id)
            if (user !== null) {
                return res.json({status: true, user: user.username})
            } else {
                return res.json({status: false})
            }
        }
    })
}