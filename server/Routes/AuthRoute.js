/*
 * AuthRoute.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');
const {Signup, Login, userVerification} = require('../Controllers/AuthController');
const googleUser = require('../Controllers/GoogleController');
const User = require("../Models/UserModel");

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/', userVerification);

///Use the 'google' authentication strategy provided by Passport.js
router.get(
    '/google',
    passport.authenticate('google', {
        session: false,
        scope: ['email', 'profile'],
    }));
router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        session: false,
        scope: ['email', 'profile'],
    }),

    // Callback function executed after successful authentication
    async (req, res) => {
        try {

            // sends secret token value as part of the cookie header to the client and creates google account for
            // database
            const result = await googleUser(req.user);
            res.cookie("token", result.token, {
                withCredentials: true,
                httpOnly: false,
            });
           // res (STILL NEED TO BE FIXED)
               // .status(201)
               // .json({message: "User signed up successfully", success: true, user: result.user});
            res.redirect("http://localhost:3000/");
        } catch (error) {
            console.error(error);
        }
    });

module.exports = router;
