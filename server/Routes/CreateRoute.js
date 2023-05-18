const {setTracks} = require("../Controllers/CreateController")
const {userVerification} = require("../Middleware/UserVerification")
const router = require("express").Router()

router.post("/tracks", userVerification, setTracks)

module.exports = router