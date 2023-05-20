/*
 * UserVerification.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const jwt = require("jsonwebtoken")
const User = require("../Models/UserModel")
const {TOKEN_KEY} = process.env

module.exports.userVerification = (req, res, next) => {
    const token = req.cookies.token
    if (token === null) {
        return res.json({status: false})
    }

    //decrypts the secret token using the token key
    jwt.verify(token, TOKEN_KEY, async (err, decoded) => {
        if (err !== null) {
            return res.json({status: false})
        } else {
            const user = await User.findById(decoded.id)
            req.email = user.email
            next()
        }
    })
}