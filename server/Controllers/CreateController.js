const User = require("../Models/UserModel");

module.exports.setTracks = async(req, res, next) => {
    const username = req.username
    const {tracks} = req.body

    //converting tracks from object to array
    const trackArr = Object.values(tracks)

    try {
        await User.updateOne({username: username}, {tracks: trackArr})
    } catch {
        return res.status(400).json({message: "error while setting user's tracks", success: false})
    }
    return res.status(200).json({message: "user's tracks successfully set", success: true})
}

