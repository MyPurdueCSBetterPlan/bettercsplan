
/*
 * AuthRoute.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const { Signup, Login} = require('../Controllers/AuthController')
const {userVerification} = require('../Middleware/UserVerification')
const router = require('express').Router()

router.post('/signup', Signup)
router.post('/login', Login)

module.exports = router
