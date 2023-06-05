const User = require("../../Models/UserModel");
const sqlite3 = require("sqlite3")

/**
 * This function gets the specified user from the client's request and returns a response containing the user's
 * schedule and everything necessary to display the user's home page. It gets the course names from MongoDB and the
 * credit hours from the sqlite database. Each "course" is represented by an object with a "name" property and a
 * "credits" property
 *
 * @param req - The request received from the client
 * @param res - The response sent to the client. The response contains:
 *                  * a list of courses the user must take (course name + credit hours)
 *                  * the user's schedule (each semester is an array; each object in an array has a name and credits)
 *                  * boolean value indicating whether the user is open to taking summer classes or not
 *
 */
module.exports.Home = async (req, res) => {
    const user = await User.findOne({email: req.email})

    const db = new sqlite3.Database("classes.db")

    try {
        const courseNames = user.coursesToTake
        const coursesWithCredits = []

        //gets the credit hours for each course name in the user's coursesToTake list (courseNames) to take
        //creates an object for each course containing the name and credit hours and pushes to coursesWithCredits array
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

        //gets the credit hours for each course name in the user's schedule
        //creates an object for each course containing the name and credit hours and pushes to the schedule array
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
            success: true,
            message: "Successfully got user data",
            name: user.name,
            coursesToTake: coursesWithCredits,
            schedule: scheduleWithCredits,
            summer: user.openToSummer
        })
    }
    catch {
        db.close()
        return res.json({
            success: false,
            message: "Your user token is no longer valid. Please login again"
        })
    }
}