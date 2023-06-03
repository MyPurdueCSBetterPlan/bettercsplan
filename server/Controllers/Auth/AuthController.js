/*
 * AuthController.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const User = require("../../Models/UserModel");
const {createSecretToken} = require("../../util/SecretToken");
const bcrypt = require("bcrypt");
const validator = require("validator");

/**
 * Handle user signup.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */

module.exports.Signup = async (req, res) => {
    let token;
    try {
        const {email, name, password} = req.body;
        const existingUser = await User.findOne({email: email});
        if (existingUser !== null) {
            return res.json({message: "This account already exist.", success: false});
        }

        if (email === null || password === null || name == null) {
            return res.json({message: "All fields are required.", status: false});
        }

        if (email === '' || password === '' || name === '') {
            return res.json({message: "All fields are required.", status: false});
        }

        if (!validator.isEmail(email)) {
            return res.json({message: "Ensure that you are writing a valid email.", status: false});
        }

        if (!validator.isStrongPassword(password)) {
            return res.json({message: "Ensure that you are writing a valid password.", status: false});
        }

        // Regular sign-up process
        const user = await User.create({
            email: email,
            name: name,
            password: password,
        });
        token = createSecretToken(user._id);

        // sends secret token value as part of the cookie header to the client
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res
            .status(201)
            .json({message: "You signed up correctly.", success: true, name: user.name});
    } catch (error) {
        if (token !== null) {
            res.clearCookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            });
        }
        res.status(401).json({message: "Something went wrong...", success: false});
        console.error(error);
    }
};


/**
 * Handle user login.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
module.exports.Login = async (req, res) => {
    let token;
    try {
        const {email, password} = req.body;

        if (email === null || password === null) {
            return res.json({message: "All fields are required.", status: false});
        }
        if (email === '' || password === '') {
            return res.json({message: "All fields are required.", status: false});
        }

        const existingUser = await User.findOne({email: email});

        if (existingUser === null) {
            return res.json({message: "Incorrect password or email.", status: false});
        }

        //if the user contains ID, means needs to log in with Google
        if (existingUser.googleID) {
            return res.json({message: "Please use Google login for this account.", status: false});
        }


        // compares password given by client and decrypted password stored in MongoDB
        const auth = await bcrypt.compare(password, existingUser.password);

        if (!auth) {
            return res.json({message: "Incorrect password or email.", status: false});
        }

        // sends secret token value as part of the cookie header to the client
        token = createSecretToken(existingUser._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({message: "You logged in correctly.", success: true, name: existingUser.name});
    } catch (error) {
        if (token !== null) {
            res.clearCookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            });
        }
        res.status(401).json({message: "Something went wrong...", success: false});
        console.error(error);
    }
};