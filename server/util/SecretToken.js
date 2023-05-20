/*
 * SecretToken.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

require("dotenv").config()
const {TOKEN_KEY} = process.env
const jwt = require("jsonwebtoken")

module.exports.createSecretToken = (id) => {
    return jwt.sign({id}, TOKEN_KEY, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};