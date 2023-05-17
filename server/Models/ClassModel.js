/*
 * ClassModel.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const mongoose = require("mongoose")

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    prerequisites: {
        type: [String]
    }
})

module.exports = mongoose.model("Class", classSchema)