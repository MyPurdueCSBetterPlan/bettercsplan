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


//It will send the information to the client to display
module.exports.ProfileInformation = async (req, res) => {
    try {
        const user = await User.findOne({email: req.email});
        if (!user.googleID) { //Check if user has Google auth.
            res
                .status(201)
                .json({
                    message: "Profile Information.",
                    success: true,
                    googleId: false,
                    email: user.email,
                    name: user.name
                });
        } else {
            res
                .status(201)
                .json({
                    message: "Profile Information.",
                    success: false,
                    googleId: true,
                    email: user.email,
                    name: user.name
                });
        }
    } catch (error) {
        res.status(401).json({message: "Something went wrong...", success: false});
        console.error(error);
    }
}

//It will handle account deletion
module.exports.DeleteAccount = async (req, res) => {
    try {
        const user = await User.findOne({email: req.email});
        await User.deleteOne(user);
        res
            .status(201)
            .json({message: "Account Deleted... GoodBye!", success: true});

    } catch (error) {
        res.status(401).json({message: "Something went wrong...", success: false});
        console.error(error);
    }
}

//It will handle user password changing
module.exports.ChangePassword = async (req, res) => {
    try {
        const user = await User.findOne({email: req.email});
        const {password} = req.body;
        if (password === null) {
            return res.json({message: "All fields are required.", status: false});
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({message: "Incorrect password...", status: false});
        }

        if (!validator.isStrongPassword(password)) {
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