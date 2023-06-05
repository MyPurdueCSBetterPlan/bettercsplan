/*
 * ProfileRoute.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const {ProfileInformation, DeleteAccount, ChangePassword} = require("../../Controllers/Profile/ProfileController")
const {userVerification} = require("../../Middleware/UserVerification");
const router = require("express").Router();

router.post("/profile", userVerification, ProfileInformation)
router.post("/profile/deleteacc", userVerification, DeleteAccount)
router.post("/profile/changepass", userVerification, ChangePassword)

module.exports = router