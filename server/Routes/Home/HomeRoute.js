/*
 * HomeRoutejs
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const {Home} = require("../../Controllers/Home/HomeController");
const {userVerification} = require("../../Middleware/UserVerification");
const router = require("express").Router()

router.post("/", userVerification, Home)

module.exports = router