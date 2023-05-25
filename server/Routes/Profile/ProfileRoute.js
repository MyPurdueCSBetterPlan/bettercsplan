/*
 * ProfileRoute.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const {Profile} = require("../../Controllers/Profile/ProfileController");
const {userVerification} = require("../../Middleware/UserVerification");
const router = require("express").Router()

router.post("/user/profile", userVerification, Profile)

module.exports = router