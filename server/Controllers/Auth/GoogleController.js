/*
 * GoogleController.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../Models/UserModel");
const {createSecretToken} = require("../../util/SecretToken");
const bcrypt = require("bcrypt");
const {generatorPassword} = require("../../util/PasswordGenerator");
require("dotenv").config();
const {CLIENT_ID, CLIENT_SECRET} = process.env;


/**
 * This will serialize the user.
 */
passport.serializeUser((user, done) => {
    done(null, user._id);
});


passport.use('login',
    new GoogleStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: "http://localhost:8000/auth/google/login/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile)
        }
    )
);

passport.use('signup',
    new GoogleStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: "http://localhost:8000/auth/google/signup/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile)
        }
    )
);

/**
 * Login a Google account into the website.
 *
 * @param {object} profile - User profile from Google authentication.
 * @returns {object|null} - Returns an object containing user data if the login is successful, null otherwise.
 */

const GoogleUserLogin = async (profile) => {
    let existingUser = await User.findOne({googleID: profile.id});
    if (existingUser === null) {
        return null;
    }

    const token = createSecretToken(existingUser._id);
    return {
        error: null,
        authenticated: true,
        token: token,
        user: {
            id: existingUser._id,
            name: existingUser.name,
            googleId: existingUser.googleID,
            email: existingUser.email,
        }
    }
}

/**
 * Sign up a Google account into the website.
 *
 * @param {object} profile - User profile from Google authentication.
 * @returns {object|null} - Returns an object containing user data if the signup is successful, null otherwise.
 */

const GoogleUserSignUp = async (profile) => {
    try {
        let existingUser = await User.findOne({googleID: profile.id});
        if (!existingUser) {
            //Creates random password
            const hashedPassword = await bcrypt.hash(generatorPassword(), 12);
            existingUser = await User.create({
                email: profile.emails[0].value,
                name: profile.name.givenName,
                googleID: profile.id,
                password: hashedPassword,
            });
            const token = createSecretToken(existingUser._id);
            //Returns the data of the user created
            return {
                error: null,
                authenticated: true,
                token: token,
                user: {
                    id: existingUser._id,
                    name: existingUser.name,
                    googleId: existingUser.googleID,
                    email: existingUser.email,
                }
            }
        } else {
            return null; // User already exist.
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}


module.exports = {
    GoogleUserLogin,
    GoogleUserSignUp
};