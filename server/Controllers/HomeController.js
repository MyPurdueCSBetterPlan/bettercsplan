const User = require("../Models/UserModel");
module.exports.Home = async (req, res) => {
    const user = await User.findOne({username: req.username})
    return res.json({status: true, user: req.username, schedule: user.schedule})
}