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
 * Get user profile information.
 * This function sends basic user information to the client, including email, name,
 * and some other booleans for display purposes.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
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
 * Delete user account.
 * This function deletes a user account from the database.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
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
 * Change user password.
 * This function changes the user's password to a new password provided by the client.
 * It also performs validation to ensure the new password is valid.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
module.exports.ChangePassword = async (req, res) => {
    try {
        const user = await User.findOne({email: req.email});
        const {oldPassword, newPassword} = req.body;

        const auth = await bcrypt.compare(oldPassword, user.password);
        if (!auth) { //Password provided by the client is not valid.
            return res.json({message: "Incorrect password...", status: false});
        }

        if (!validator.isStrongPassword(newPassword)) { //Password is not valid
            return res.json({message: "Ensure that you are writing a valid password.", status: false});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await User.updateOne({email: req.email}, {password: hashedPassword})
        res
            .status(201)
            .json({message: "Password changed... Logging out!", status: true});
    } catch (error) {
        res.status(401).json({message: "Something went wrong...", status: false});
        console.error(error);
    }
}