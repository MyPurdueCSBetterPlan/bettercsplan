/*
 * AuthRoute.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const express = require('express');
const router = express.Router();
const {Signup, Login} = require('../../Controllers/Auth/AuthController');
const passport = require('passport');
const {GoogleUserLogin, GoogleUserSignUp} = require("../../Controllers/Auth/GoogleController");

router.post('/signup', Signup);
router.post('/login', Login);

//Use the 'google' authentication strategy provided by Passport.js (Google Login)
router.get(
    '/google/login',
    passport.authenticate('login', {
        session: false,
        scope: ['email', 'profile'],
    }));

//Google Login
router.get(
    '/auth/google/login/callback',
    passport.authenticate('login', {
        session: false,
        scope: ['email', 'profile'],
    }),

    // Callback function executed after successful authentication
    async (req, res) => {
        try {
            // sends secret token value as part of the cookie header to the client and creates google account for
            // database
            const result = await GoogleUserLogin(req.user);
            if (result === null) { //User does not exist
                res.send(`
                <html lang="en">
                    <body>
                        <script>
                            window.onload = function() {
                                window.opener.postMessage({type: 'AUTH_SUCCESS', payload: ${JSON.stringify(
                    result,
                )}}, 'http://localhost:3000/');
                                window.close();
                            };
                        </script>
                    </body>
                </html>
            `);
            } else {
                res.cookie("token", result.token, {
                    withCredentials: true,
                    httpOnly: false,
                });
                res.send(`
                <html lang="en">
                    <body>
                        <script>
                            window.onload = function() {
                                window.opener.postMessage({type: 'AUTH_SUCCESS', payload: ${JSON.stringify(
                    result,
                )}}, 'http://localhost:3000/');
                                window.close();
                            };
                        </script>
                    </body>
                </html>
          `);
            }
        } catch (error) {
            res.send(`
                <html lang="en">
                    <body>
                        <script>
                            window.onload = function() {
                                window.opener.postMessage({type: 'AUTH_ERROR', payload: ${JSON.stringify(
                null,
            )}}, 'http://localhost:3000/login');
                                window.close();
                            };
                        </script>
                    </body>
                </html>
          `);
        }
    });


///Use the 'google' authentication strategy provided by Passport.js (Google Signup)
router.get(
    '/google/signup',
    passport.authenticate('signup', {
        session: false,
        scope: ['email', 'profile'],
    }));


//Google Signup
router.get(
    '/auth/google/signup/callback',
    passport.authenticate('signup', {
        session: false,
        scope: ['email', 'profile'],
    }),

    // Callback function executed after successful authentication
    async (req, res) => {
        try {
            // sends secret token value as part of the cookie header to the client and creates google account for
            // database
            const result = await GoogleUserSignUp(req.user);
            res.cookie("token", result.token, {
                withCredentials: true,
                httpOnly: false,
            });
            res.send(`
                <html lang="en">
                    <body>
                        <script>
                            window.onload = function() {
                                window.opener.postMessage({type: 'AUTH_SUCCESS', payload: ${JSON.stringify(
                result,
            )}}, 'http://localhost:3000/');
                                window.close();
                            };
                        </script>
                    </body>
                </html>
          `);
        } catch (error) {
            res.send(`
                <html lang="en">
                    <body>
                        <script>
                            window.onload = function() {
                                window.opener.postMessage({type: 'AUTH_ERROR', payload: ${JSON.stringify(
                null,
            )}}, 'http://localhost:3000/login');
                                window.close();
                            };
                        </script>
                    </body>
                </html>
          `);
        }
    });

module.exports = router;
