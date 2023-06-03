const User = require("../../Models/UserModel")

module.exports.UpdateSchedule = async (req, res) => {
    try {
        const user = await User.findOne({email: req.email})

        let schedule = user.schedule
        const {semIndex, classNames} = req.body

        schedule[semIndex] = classNames

        await User.updateOne({email: req.email}, {schedule: schedule})
        return res.status(200).json("Successfully updated schedule")
    } catch {
        return res.status(400).json("Schedule was not able to be updated")
    }
}