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
    tracks: {
        type: [String]
    },
    taken: {
        type: [String]
    },
    timeGrad: {
        type: Number
    },
    maxCredits: {
        type: Number
    },
    openToSummer: {
        type: Boolean,
        default: false
    },
    //Each subarray contains the class names for a particular semester
    schedule: {
        type: [[String]]
    }
})

//before saving user, hash their password
userSchema.pre("save", async function() {
    this.password = await bcrypt.hash(this.password, 12)
})

module.exports = mongoose.model("User", userSchema)

