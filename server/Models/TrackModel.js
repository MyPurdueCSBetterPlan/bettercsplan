const mongoose = require("mongoose")

const trackSchema = new mongoose.Schema({
    name: {
        type: String
    },
    required: {
        type: Array
    },
    elective: {
        type: Array
    },
    choose: {
        type: Number
    }
})

module.exports = mongoose.model("Track", trackSchema)