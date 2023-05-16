const User = require("../Models/UserModel");
require("dotenv").config();
const {TOKEN_KEY} = process.env
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
    const token = req.cookies.token
    if (token === null) {
        return res.json({ status: false })
    }
    jwt.verify(token, TOKEN_KEY, async (err, decoded) => {
        if (err !== null) {
            return res.json({ status: false })
        } else {
            const user = await User.findById(decoded.id)
            if (user !== null) {
                return res.json({status: true, user: user.username})
            }
            else {
                return res.json({status: false})
            }
        }
    })
}