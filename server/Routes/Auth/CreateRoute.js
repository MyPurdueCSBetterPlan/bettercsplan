/*
 * CreateRoute.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const {setTracks, getClasses, setTaken, setOptions} = require("../../Controllers/Auth/CreateController")
const {userVerification} = require("../../Middleware/UserVerification")
const router = require("express").Router()

router.post("/tracks", userVerification, setTracks)
router.get("/classes", userVerification, getClasses)
router.post("/classes", userVerification, setTaken)
router.post("/options", userVerification, setOptions)

module.exports = router