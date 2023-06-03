/*
 * HomeRoutejs
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const {Home} = require("../../Controllers/Home/HomeController");
const {UpdateSchedule} = require("../../Controllers/Home/ScheduleController")
const {userVerification} = require("../../Middleware/UserVerification");
const router = require("express").Router()

router.post("/", userVerification, Home)
router.post("/schedule", userVerification, UpdateSchedule)

module.exports = router