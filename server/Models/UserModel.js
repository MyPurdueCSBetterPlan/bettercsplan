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
    username: {
        type: String,
        required: [true, "Your username is required"]
    },
    password: {
        type: String,
        required: [true, "Your password is required"]
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },

    //Each subarray contains the class names for a particular semester
    schedule: {
        type: [[String]]
    },
    openToSummer: {
        type: Boolean,
        default: false
    }
})

//before saving user, hash their password
userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12)
})

module.exports = mongoose.model("User", userSchema)

