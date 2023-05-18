const {setTracks, getClasses} = require("../Controllers/CreateController")
const {userVerification} = require("../Middleware/UserVerification")
const router = require("express").Router()

router.post("/tracks", userVerification, setTracks)
router.get("/classes", userVerification, getClasses)

module.exports = router