/*
 * ProfileRoute.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const {ProfileInformation, DeleteAccount} = require("../../Controllers/Profile/ProfileController");
const {userVerification} = require("../../Middleware/UserVerification");
const router = require("express").Router()

router.post("/profile", userVerification, ProfileInformation)
router.post("/profile/deleteacc", userVerification, DeleteAccount)

module.exports = router