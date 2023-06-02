/*
 * HomeController.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const User = require("../../Models/UserModel");
const sqlite3 = require("sqlite3")

module.exports.Home = async (req, res) => {
    const user = await User.findOne({email: req.email})

    const courseNames = user.coursesToTake
    const db = new sqlite3.Database("classes.db")
    const coursesWithCredits = []

    await new Promise(async (resolve, reject) => {
        for (let i = 0; i < courseNames.length; i++) {
            await new Promise((res, reject) => {
                db.get('SELECT credit_hours FROM classesList WHERE class_id = ?', [courseNames[i]],
                    (err, row) => {
                        coursesWithCredits.push({name: courseNames[i], credits: row.credit_hours})
                        res()
                    })
            })
        }
        resolve()
    })

    return res.json({
        status: true, name: req.name, coursesToTake: coursesWithCredits,
        schedule: user.schedule, summer: user.openToSummer
    })
}