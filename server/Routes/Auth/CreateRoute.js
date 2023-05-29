/*
 * CreateRoute.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const {setTracks, getClasses, setTaken, setOptions, coreSciAdd, csAdd} = require("../../Controllers/Auth/CreateController")
const {userVerification} = require("../../Middleware/UserVerification")
const router = require("express").Router()

router.post("/tracks", userVerification, setTracks)
router.post("/classes", userVerification, getClasses)
router.post("/taken", userVerification, setTaken)
router.post("/options", userVerification, setOptions)
router.get("/generate", userVerification, coreSciAdd, csAdd)

module.exports = router