/*
 * HomeRoutejs
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const {Home} = require("../../Controllers/Home/HomeController");
const {AddClass, RemoveClass, getAlternatives, ReplaceClass, ReplaceSequence, removeOldClass} = require("../../Controllers/Home/ScheduleController")
const {userVerification} = require("../../Middleware/UserVerification");
const router = require("express").Router()

router.post("/", userVerification, Home)
router.post("/schedule-add", userVerification, AddClass)
router.post("/schedule-remove", userVerification, RemoveClass)
router.post("/schedule-move", userVerification, AddClass, removeOldClass)
router.post("/schedule-alternateList", userVerification, getAlternatives)
router.post("/schedule-replace", userVerification, ReplaceClass)
router.post("/schedule-replace-sequence", userVerification, ReplaceSequence)

module.exports = router