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

// called when post request is sent to "/signup"
module.exports.Signup = async (req, res) => {
    try {
        const {email, name, password} = req.body;
        const existingUser = await User.findOne({email: email});
        if (existingUser !== null) {
            return res.json({message: "This account already exist.", success: false});
        }

        if (email === null || password === null || name == null) {
            return res.json({message: "All fields are required."});
        }

        if (email === '' || password === '' || name === '') {
            return res.json({ message: "All fields are required." });
        }

        // Regular sign-up process
        const user = await User.create({
            email: email,
            name: name,
            password: password,
        });
        const token = createSecretToken(user._id);

        // sends secret token value as part of the cookie header to the client
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res
            .status(201)
            .json({message: "You signed up correctly.", success: true, name: user.name});
    } catch (error) {
        console.error(error);
    }
};


// called when post request is sent to "/login"
module.exports.Login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (email === null || password === null) {
            return res.json({message: "All fields are required."});
        }
        if (email === '' || password === '') {
            return res.json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({email: email});

        if (existingUser === null) {
            return res.json({message: "Incorrect password or email."});
        }

        //if the user contains ID, means needs to log in with google
        if (existingUser.googleID) {
            return res.json({message: "Please use Google login for this account."});
        }


        // compares password given by client and decrypted password stored in MongoDB
        const auth = await bcrypt.compare(password, existingUser.password);

        if (!auth) {
            return res.json({message: "Incorrect password or email."});
        }

        // sends secret token value as part of the cookie header to the client
        const token = createSecretToken(existingUser._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({message: "You logged in correctly.", success: true, name: existingUser.name});
    } catch (error) {
        console.error(error);
    }
};