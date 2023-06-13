/*
 * UserModel.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Your email is required"]
    },
    name: {
        type: String,
    },
    googleID: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Your password is required"]
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    tracks: {
        type: [String]
    },
    taken: {
        type: [String]
    },
    years: {
        type: Number
    },
    openToSummer: {
        type: Boolean,
        default: false
    },
    coursesToTake: {
        type: [String]
    },
    schedule: {
        type: [[String]]
    },
    //array of lab sequence arrays of class names
    sci_alt: {
        type: [[String]]
    },
    //array of arrays of language sequences
    lang_alt: {
        type: [[String]]
    }
})

//before saving user, hash their password
userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12)
})

module.exports = mongoose.model("User", userSchema)

