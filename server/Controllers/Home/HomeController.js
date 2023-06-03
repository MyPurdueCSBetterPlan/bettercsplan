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

    const db = new sqlite3.Database("classes.db")

    const courseNames = user.coursesToTake
    const coursesWithCredits = []

    await new Promise(async (resolve, reject) => {
        for (let i = 0; i < courseNames.length; i++) {
            await new Promise((res, rej) => {
                db.get('SELECT credit_hours FROM classesList WHERE class_id = ?',
                    [courseNames[i]],
                    (err, row) => {
                        coursesWithCredits.push({name: courseNames[i], credits: row.credit_hours})
                        res()
                    })
            })
        }
        resolve()
    })

    const scheduleNames = user.schedule
    const scheduleWithCredits = []

    await new Promise(async (resolve, reject) => {
        for (let i = 0; i < scheduleNames.length; i++) {
            scheduleWithCredits.push([])
            for (let j = 0; j < scheduleNames[i].length; j++) {
                await new Promise((res, rej) => {
                    db.get('SELECT credit_hours FROM classesList WHERE class_id = ?',
                        [scheduleNames[i][j]],
                        (err, row) => {
                            scheduleWithCredits[i].push({name: scheduleNames[i][j], credits: row.credit_hours})
                            res()
                        })
                })
            }
        }
        resolve()
    })

    db.close()



    return res.json({
        status: true, name: req.name, coursesToTake: coursesWithCredits,
        schedule: scheduleWithCredits, summer: user.openToSummer
    })
}