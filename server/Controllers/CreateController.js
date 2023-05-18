const User = require("../Models/UserModel")
const Class = require("../Models/ClassModel")

//sets a user's tracks
module.exports.setTracks = async(req, res) => {
    const username = req.username
    const {tracks} = req.body

    //converting tracks from object to array
    const trackArr = Object.values(tracks)

    try {
        await User.updateOne({username: username}, {tracks: trackArr})
        return res.status(200).json({message: "user's tracks successfully set", success: true})
    } catch {
        return res.status(400).json({message: "error while setting user's tracks", success: false})
    }
}

//gives a list of all classes back to the client
module.exports.getClasses = async(req, res) => {
    try {
        let classes = await Class.find({}, "name")
        classes = classes.map(classObj => classObj.name)
        return res.status(200).json({message: "got all classes", classes: classes, success: true})
    } catch {
        return res.status(400).json({message: "error getting all classes", success: false})
    }
}

