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


// Serialize user
passport.serializeUser((user, done) => {
    done(null, user._id);
});

//
passport.use('google',
    new GoogleStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: "http://localhost:8000/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile)
        }
    )
);

//This function will create a Google account for the database.
const googleUser = async (profile) => {
    try {
        let existingUser = await User.findOne({googleID: profile.id});
        if (!existingUser) {
            //Creates random password
            const hashedPassword = await bcrypt.hash(generatorPassword(), 10);
            existingUser = await User.create({
                email: profile.emails[0].value,
                name: profile.name.givenName,
                googleID: profile.id,
                password: hashedPassword
            });
        }
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
    } catch (error) {
        console.log(error);
    }
}


module.exports = googleUser;