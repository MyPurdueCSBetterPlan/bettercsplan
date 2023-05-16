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
})

//before saving user, hash their password
userSchema.pre("save", async function() {
    this.password = await bcrypt.hash(this.password, 12)
})

module.exports = mongoose.model("User", userSchema)

