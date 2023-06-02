/*
 * ProfileController.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const User = require("../../Models/UserModel");
const bcrypt = require("bcrypt");
const validator = require("validator");


/**
 * This function will send the basic information to the client.
 * It will send user email, name and some other booleans for
 * display reasons.
 */

module.exports.ProfileInformation = async (req, res) => {
    try {
        const user = await User.findOne({email: req.email});
        if (user.coursesToTake.length !== 0) {
            if (!user.googleID) { //Check if user has Google auth.
                res
                    .status(201)
                    .json({
                        status: true,
                        googleID: false,
                        email: user.email,
                        name: user.name,
                        verified: true
                    });
            } else {
                res
                    .status(201)
                    .json({
                        status: true,
                        googleID: true,
                        email: user.email,
                        name: user.name,
                        verified: true
                    });
            }
        } else {
            res
                .status(201)
                .json({
                    status: true,
                    googleID: true,
                    email: user.email,
                    name: user.name,
                    verified: false
                });
        }
    } catch (error) {
        res.status(401).json({status: false});
        console.error(error);
    }
}

/**
 * This function will delete an account from our database.
 */

module.exports.DeleteAccount = async (req, res) => {
    try {
        const user = await User.findOne({email: req.email});
        await User.deleteOne(user);
        res
            .status(201)
            .json({success: true});

    } catch (error) {
        res.status(401).json({success: false});
        console.error(error);
    }
}

/**
 * This function will change the users password sent by the client to a
 * new password. It will check if it's a valid password as well.
 */

module.exports.ChangePassword = async (req, res) => {
    try {
        const user = await User.findOne({email: req.email});
        const {password} = req.body;
        if (password === null) { //Empty password field
            return res.json({message: "All fields are required.", status: false});
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) { //Password provided by the client is not valid.
            return res.json({message: "Incorrect password...", status: false});
        }

        if (!validator.isStrongPassword(password)) { //Password is not valid
            return res.json({message: "Ensure that you are writing a valid password.", status: false});
        }

        user.password = password;
        res
            .status(201)
            .json({message: "Password changed... Logging out!", logOut: true});
    } catch (error) {
        res.status(401).json({message: "Something went wrong...", logOut: false});
        console.error(error);
    }
}