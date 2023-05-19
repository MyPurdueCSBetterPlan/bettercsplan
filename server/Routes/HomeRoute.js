const {Home} = require("../Controllers/HomeController");
const {userVerification} = require("../Middleware/UserVerification");
const router = require("express").Router()

router.post("/", userVerification, Home)

module.exports = router