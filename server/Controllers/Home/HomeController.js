/*
 * HomeController.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const User = require("../../Models/UserModel");
module.exports.Home = async (req, res) => {
    const user = await User.findOne({email: req.email})
    return res.json({status: true, name: req.name, schedule: user.schedule})
}