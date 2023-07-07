const User = require("../../Models/UserModel")
const sqlite3 = require("sqlite3");


/**
 * This function is called whenever the user attempts to add a class to their schedule on the client-side.
 * This function should first see if the class can be added based on its prereqs. If not, it will return
 * an error message back to the client. If the class can be added, the user's schedule and coursesToTake
 * are updated in mongoDB
 *
 * @param req - request received from the client. The request contains:
 *              * semIndex - index w/in schedule array containing the classes for the semester that was modified
 *              * className - name of the class that was added to the schedule
 * @param res - response sent back to the client. The response contains:
 *              * message - describes whether successful or not
 *              * success - true/false based on whether successful or not
 * @param next - calls removeOldClass in case the user is moving a class from one semester to another
 *
 */
module.exports.AddClass = async (req, res, next) => {
    try {
        const {semIndex, className, move} = req.body

        //gets user data from MongoDB
        const user = await User.findOne({email: req.email})

        let schedule = user.schedule
        let taken = user.taken
        let coursesToTake = user.coursesToTake

        //TODO: this is duplicated code from HomeController.js...maybe find a way to reuse instead of copy/paste
        const db = new sqlite3.Database("classes.db")

        const courseNames = user.coursesToTake
        const coursesWithCredits = []
        let semestersAllowed = ""

        //gets the credit hours for each course name in the user's coursesToTake list (courseNames) to take
        //creates an object for each course containing the name and credit hours and pushes to coursesWithCredits array
        await new Promise(async (resolve, reject) => {
            for (let i = 0; i < courseNames.length; i++) {
                await new Promise((res, rej) => {
                    db.get('SELECT credit_hours, semesters_offered FROM classesList WHERE class_id = ?',
                        [courseNames[i]],
                        (err, row) => {
                            coursesWithCredits.push({name: courseNames[i], credits: row.credit_hours})
                            if (courseNames[i] === className) {
                                semestersAllowed = row.semesters_offered
                            }
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

        //check to see if class can be taken in the chosen semester
        console.log(semestersAllowed)
        if (semestersAllowed !== null && semestersAllowed !== "") {
            const summer = user.openToSummer
            const years = user.years
            if (summer) {
                const semester = semIndex % 3
                if (semester === 0) { //fall
                    if (!semestersAllowed.includes("Fall")) {
                        return res.status(200).json({
                            message: "This class is not available in the Fall semester",
                            success: false,
                            coursesToTake: coursesWithCredits,
                            schedule: scheduleWithCredits
                        })
                    }
                } else if (semester === 1) { //spring
                    if (!semestersAllowed.includes("Spring")) {
                        return res.status(200).json({
                            message: "This class is not available in the Spring semester",
                            success: false,
                            coursesToTake: coursesWithCredits,
                            schedule: scheduleWithCredits
                        })
                    }
                } else { //summer
                    if (!semestersAllowed.includes("Summer")) {
                        return res.status(200).json({
                            message: "This class is not available in the Summer semester",
                            success: false,
                            coursesToTake: coursesWithCredits,
                            schedule: scheduleWithCredits
                        })
                    }
                }

            }
            else {
                const semester = semIndex % 2
                if (semester === 0) { //fall
                    if (!semestersAllowed.includes("Fall")) {
                        return res.status(200).json({
                            message: "This class is not available in the Fall semester",
                            success: false,
                            coursesToTake: coursesWithCredits,
                            schedule: scheduleWithCredits
                        })
                    }
                }
                else { //spring
                    if (!semestersAllowed.includes("Spring")) {
                        return res.status(200).json({
                            message: "This class is not available in the Spring semester",
                            success: false,
                            coursesToTake: coursesWithCredits,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
        }

        //array to store all the classes that the user has listed on their schedule for the previous semesters
        let previousSemClasses = []
        for (let i = 0; i < semIndex; i++) {
            previousSemClasses.push(...schedule[i])
        }

        const currentSemClasses = schedule[semIndex]

        //checking pre-reqs
        const prefix = className.split(" ")[0]
        const number = className.split(" ")[1]
        if (className === "CS 18000") {
            if (!taken.includes("MA 16100") && !previousSemClasses.includes("MA 16100") &&
                !currentSemClasses.includes("MA 16100")) {
                return res.status(200).json({
                    message: "MA 16100 must be taken before or concurrently",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 18200" || className === "CS 24000") {
            if (!taken.includes("CS 18000") && !previousSemClasses.includes("CS 18000")) {
                return res.status(200).json({
                    message: "CS 18000 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 25000" || className === "CS 25100") {
            if ((!taken.includes("CS 24000") && !previousSemClasses.includes("CS 24000")) ||
                (!taken.includes("CS 18200") && !previousSemClasses.includes("CS 18200"))) {
                return res.status(200).json({
                    message: "CS 24000 and CS 18200 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 25200") {
            if ((!taken.includes("CS 25000") && !previousSemClasses.includes("CS 25000")) ||
                (!taken.includes("CS 25100") && !previousSemClasses.includes("CS 25100"))) {
                return res.status(200).json({
                    message: "CS 25000 and CS 25100 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 40800" || className === "CS 44800" || className === "CS 47100" ||
                 className === "CS 47300" || className === "CS 34800" || className === "CS 30700") {
            if (!taken.includes("CS 25100") && !previousSemClasses.includes("CS 25100")) {
                return res.status(200).json({
                    message: "CS 25100 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 40700") {
            if (!taken.includes("CS 30700") && !previousSemClasses.includes("CS 30700")) {
                return res.status(200).json({
                    message: "CS 30700 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 48900" || className === "CS 35400" || className === "CS 35200") {
            if (!taken.includes("CS 25200") && !previousSemClasses.includes("CS 25200")) {
                return res.status(200).json({
                    message: "CS 25200 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 42200" || className === "CS 42600") {
            if (!taken.includes("CS 35400") && !previousSemClasses.includes("CS 35400") &&
                !currentSemClasses.includes("CS 35400")) {
                return res.status(200).json({
                    message: "CS 35400 must be taken before or concurrently",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 45600") {
            if (!taken.includes("CS 35200") && !previousSemClasses.includes("CS 35200") &&
                !previousSemClasses.includes("CS 35200")) {
                return res.status(200).json({
                    message: "CS 35200 must be taken before or concurrently",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 35300") {
            if (!taken.includes("CS 35200") && !previousSemClasses.includes("CS 35200")) {
                return res.status(200).json({
                    message: "CS 35200 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "MA 16200") {
            if (!taken.includes("MA 16100") && !previousSemClasses.includes("MA 16100")) {
                return res.status(200).json({
                    message: "MA 16100 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "STAT 35000" || className === "MA 26100") {
            if (!taken.includes("MA 16200") && !previousSemClasses.includes("MA 16200")) {
                return res.status(200).json({
                    message: "MA 162 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "MA 26500") {
            if (!taken.includes("MA 26100") && !previousSemClasses.includes("MA 26100") &&
                !currentSemClasses.includes("MA 26100")) {
                return res.status(200).json({
                    message: "MA 26100 must be taken before or concurrently",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className.includes("CS 37300")) {
            if ((!taken.includes("CS 25100") && !previousSemClasses.includes("CS 25100")) ||
                (!taken.includes("STAT 35000") && !previousSemClasses.includes("STAT 35000") &&
                 !currentSemClasses.includes("STAT 35000"))) {
                return res.status(200).json({
                    message: "CS 25100 must be taken before and STAT 35000 must be taken before or concurrently",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 38100") {
            if ((!taken.includes("CS 25100") && !previousSemClasses.includes("CS 25100")) ||
                (!taken.includes("MA 26100") && !previousSemClasses.includes("MA 26100"))) {
                return res.status(200).json({
                    message: "CS 25100 and MA 26100 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 48300") {
            if (!taken.includes("CS 38100") && !previousSemClasses.includes("CS 38100")) {
                return res.status(200).json({
                    message: "CS 38100 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 31400") {
            if ((!taken.includes("CS 18000") && !previousSemClasses.includes("CS 18000")) ||
                (!taken.includes("MA 26500") && !previousSemClasses.includes("MA 26500"))) {
                return res.status(200).json({
                    message: "CS 18000 and MA 26500 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 35500") {
            if ((!taken.includes("CS 25100") && !previousSemClasses.includes("CS 25100")) ||
                (!taken.includes("STAT 35000") && !previousSemClasses.includes("STAT 35000") &&
                 !taken.includes("MA 26500") && !previousSemClasses.includes("MA 26500"))) {
                return res.status(200).json({
                    message: "CS 25100 must be taken before and either STAT 35000 or MA 26500 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 33400") {
            if ((!taken.includes("CS 24000") && !previousSemClasses.includes("CS 24000")) ||
                (!taken.includes("MA 26500") && !previousSemClasses.includes("MA 26500"))) {
                return res.status(200).json({
                    message: "CS 24000 and MA 26500 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CS 43400") {
            if (!taken.includes("CS 33400") && !previousSemClasses.includes("CS 33400")) {
                return res.status(200).json({
                    message: "CS 3340 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "BIOL 11100") {
            if (!taken.includes("BIOL 11000") && !previousSemClasses.includes("BIOL 11000")) {
                return res.status(200).json({
                    message: "BIOL 11000 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "BIOL 13100") {
            if (!taken.includes("BIOL 12100") && !previousSemClasses.includes("BIOL 12100")) {
                return res.status(200).json({
                    message: "BIOL 12100 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "BIOL 13500") {
            if (!taken.includes("BIOL 13100") && !previousSemClasses.includes("BIOL 13100")) {
                return res.status(200).json({
                    message: "BIOL 13100 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CHM 11600") {
            if (!taken.includes("CHM 11500") && !previousSemClasses.includes("CHM 11500")) {
                return res.status(200).json({
                    message: "CHM 11500 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "CHM 12600") {
            if (!taken.includes("CHM 12500") && !previousSemClasses.includes("CHM 12500")) {
                return res.status(200).json({
                    message: "CHM 12500 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === "EAPS 11200") {
            if (!taken.includes("EAPS 11100") && !previousSemClasses.includes("EAPS 11100")) {
                return res.status(200).json({
                    message: "EAPS 11100 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        //https://selfservice.mypurdue.purdue.edu/prod/bwckctlg.p_disp_course_detail?cat_term_in=202410&subj_code_in=PHYS&crse_numb_in=22100
        else if (className === "PHYS 22100") {
            if ((!taken.includes("PHYS 22000") && !previousSemClasses.includes("PHYS 22000")) ||
                (!taken.includes("PHYS 17200") && !previousSemClasses.includes("PHYS 17200"))) {
                return res.status(200).json({
                    message: "Either PHYS 22000 or PHYS 17200 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        //https://selfservice.mypurdue.purdue.edu/prod/bwckctlg.p_disp_course_detail?cat_term_in=202410&subj_code_in=PHYS&crse_numb_in=27200
        else if (className === "PHYS 27200") {
            if (!taken.includes("PHYS 17200") && !previousSemClasses.includes("PHYS 17200")) {
                return res.status(200).json({
                    message: "PHYS 17200 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        //https://selfservice.mypurdue.purdue.edu/prod/bwckctlg.p_disp_course_detail?cat_term_in=202410&subj_code_in=PHYS&crse_numb_in=23400
        else if (className === "PHYS 23400") {
            if ((!taken.includes("PHYS 22000") && !previousSemClasses.includes("PHYS 22000")) ||
                (!taken.includes("PHYS 17200") && !previousSemClasses.includes("PHYS 17200")) ||
                (!taken.includes("PHYS 23300") && !previousSemClasses.includes("PHYS 23300"))) {
                return res.status(200).json({
                    message: "Either PHYS 22000 or PHYS 17200 or PHYS 23300 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        //https://selfservice.mypurdue.purdue.edu/prod/bwckctlg.p_disp_course_detail?cat_term_in=202410&subj_code_in=PHYS&crse_numb_in=24100
        else if (className === "PHYS 24100") {
            if (!taken.includes("PHYS 17200") && !previousSemClasses.includes("PHYS 17200")) {
                return res.status(200).json({
                    message: "PHYS 17200 must be taken before",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        //language prereqs
        else if (prefix === "ASL" || prefix === "ARAB" || prefix === "CHNS" || prefix === "FR" || prefix === "GER" ||
                 prefix === "GREK" || prefix === "HEBR" || prefix === "ITAL" || prefix === "JPNS" || prefix === "KOR" ||
                 prefix === "LATN" || prefix === "PTGS" || prefix === "RUSS" || prefix === "SPAN") {
            if (number === "10200") {
                const prereq = prefix + " 10100"
                if (!taken.includes(prereq) && !previousSemClasses.includes(prereq)) {
                    return res.status(200).json({
                        message: prereq + " must be taken before",
                        success: false,
                        coursesToTake: coursesWithCredits,
                        schedule: scheduleWithCredits
                    })
                }
            }
            else if (number === "20100") {
                const prereq = prefix + " 10200"
                if (!taken.includes(prereq) && !previousSemClasses.includes(prereq)) {
                    return res.status(200).json({
                        message: prereq + " must be taken before",
                        success: false,
                        coursesToTake: coursesWithCredits,
                        schedule: scheduleWithCredits
                    })
                }
            }
            else if (number === "20200") {
                const prereq = prefix + " 20100"
                if (!taken.includes(prereq) && !previousSemClasses.includes(prereq)) {
                    return res.status(200).json({
                        message: prereq + " must be taken before",
                        success: false,
                        coursesToTake: coursesWithCredits,
                        schedule: scheduleWithCredits
                    })
                }
            }
        }

        //updating semester classes
        currentSemClasses.push(className)
        schedule[semIndex] = currentSemClasses

        //updating coursesToTake
        coursesToTake.splice(coursesToTake.indexOf(className), 1)


        //updating user's data in mongoDB
        await User.updateOne({email: req.email}, {schedule: schedule, coursesToTake: coursesToTake})

        if (move) {
            return next()
        }

        return res.status(200).json({
            message: "Successfully updated schedule",
            success: true
        })
    }
    catch {
        return res.status(400).json({
            message: "Something went wrong while trying to update your schedule",
        })
    }
}


/**
 * This function is called whenever the user removes a class from their schedule back to their classesToTake list
 * This function should update the user's schedule and coursesToTake in MongoDB accordingly
 *
 * @param req - the request received from the client
 * @param res - the response sent back to the client. The response contains:
 *              * message - describes whether successful or not
 *              * success - true/false based on whether successful or not
 */
module.exports.RemoveClass = async (req, res) => {
    try {
        const {className} = req.body

        //gets user data from mongoDB
        const user = await User.findOne({email: req.email})

        let scheduleNames = user.schedule
        let courseNames = user.coursesToTake


        //TODO: duplicated code from HomeController.js...maybe reuse instead of copy/paste
        const db = new sqlite3.Database("classes.db")

        const coursesWithCredits = []
        let semestersAllowed = ""

        //gets the credit hours for each course name in the user's coursesToTake list (courseNames) to take
        //creates an object for each course containing the name and credit hours and pushes to coursesWithCredits array
        await new Promise(async (resolve, reject) => {
            for (let i = 0; i < courseNames.length; i++) {
                await new Promise((res, rej) => {
                    db.get('SELECT credit_hours, semesters_offered FROM classesList WHERE class_id = ?',
                        [courseNames[i]],
                        (err, row) => {
                            coursesWithCredits.push({name: courseNames[i], credits: row.credit_hours})
                            if (courseNames[i] === className) {
                                semestersAllowed = row.semesters_offered
                            }
                            res()
                        })
                })
            }
            resolve()
        })

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



        //flattened list of courses in schedule
        let scheduleNamesList = user.schedule.flat()


        //makes sure that class can be removed
        if (className === 'MA 16100') {
            if (scheduleNamesList.includes('CS 18000') || scheduleNamesList.includes('CS 18200') ||
                scheduleNamesList.includes('MA 16200')) {
                return res.status(200).json({
                    message: "MA 16100 is a prereq for CS 18000, CS 18200, and MA 16200. Remove those classes first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'MA 16200') {
            if (scheduleNamesList.includes('STAT 35000') || scheduleNamesList.includes('MA 26100')) {
                return res.status(200).json({
                    message: "MA 16200 is a prereq for STAT 35000 and MA 26100. Remove those classes first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'STAT 35000') {

            //checking if schedule contains MA 26500 and its placement relative to STAT 35000
            let replaceable = false
            if (scheduleNamesList.includes('MA 26500')) {
                for (let i = 0; i < scheduleNames.length; i++) {
                    if (scheduleNames[i].includes('MA 26500')) {
                        replaceable = true
                    }
                    if (scheduleNames[i].includes('STAT 35000')) {
                        break
                    }
                }
            }

            if (scheduleNamesList.includes('CS 37300') || (scheduleNamesList.includes('CS 35500') && !replaceable)){
                return res.status(200).json({
                    message: "STAT 35000 is a prereq for CS 37300 and CS 35500. Remove those classes first.",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'MA 26100') {
            if (scheduleNamesList.includes('MA 26500') || scheduleNamesList.includes('CS 38100')) {
                return res.status(200).json({
                    message: "MA 26100 is a prereq for MA 26500 and CS 38100. Remove those classes first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'MA 26500') {

            //checking if schedule contains STAT 35000 and its placement relative to MA 26500
            let replaceable = false
            if (scheduleNamesList.includes('STAT 35000')) {
                for (let i = 0; i < scheduleNames.length; i++) {
                    if (scheduleNames[i].includes('STAT 35000')) {
                        replaceable = true
                    }
                    if (scheduleNames[i].includes('MA 26500')) {
                        break
                    }
                }
            }

            if (scheduleNamesList.includes('CS 31400') || (scheduleNamesList.includes('CS 35500') && !replaceable)) {
                return res.status(200).json({
                    message: "MA 26500 is a prereq for CS 31400 and CS 35500. Remove those classes first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'CS 18000') {
            if (scheduleNamesList.includes('CS 18200') || scheduleNamesList.includes('CS 24000') ||
                scheduleNamesList.includes('CS 31400')) {
                return res.status(200).json({
                    message: "CS 18000 is a prereq for CS 18200, CS 24000, and CS 31400. Remove those classes first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'CS 18200') {
            if (scheduleNamesList.includes('CS 25000') || scheduleNamesList.includes('CS 25100')) {
                return res.status(200).json({
                    message: "CS 18200 is a prereq for CS 25000 and CS 25100. Remove those classes first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'CS 24000') {
            if (scheduleNamesList.includes('CS 25000') || scheduleNamesList.includes('CS 25100') ||
                scheduleNamesList.includes('CS 33400')) {
                return res.status(200).json({
                    message: "CS 24000 is a prereq for CS 25000, CS 25100, and CS 33400. Remove those classes first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'CS 25000') {
            if (scheduleNamesList.includes('CS 25200')) {
                return res.status(200).json({
                    message: "CS 25000 is a prereq for CS 25200. Remove that class first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'CS 25100') {
            if (scheduleNamesList.includes('CS 25200') || scheduleNamesList.includes('CS 40800') ||
                scheduleNamesList.includes('CS 44800') || scheduleNamesList.includes('CS 47100') ||
                scheduleNamesList.includes('CS 47300') || scheduleNamesList.includes('CS 34800') ||
                scheduleNamesList.includes('CS 30700') || scheduleNamesList.includes('CS 37300') ||
                scheduleNamesList.includes('CS 38100') || scheduleNamesList.includes('CS 35500')){
                return res.status(200).json({
                    message: "CS 25100 is a prereq for CS 25200, CS 40800, CS 44800, CS 47100, CS 47300, CS 34800, " +
                        "CS 30700, CS 37300, CS 38100, and CS 35500. Remove these classes first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'CS 25200') {
            if (scheduleNamesList.includes('CS 48900') || scheduleNamesList.includes('CS 35400') ||
                scheduleNamesList.includes('CS 35200')) {
                return res.status(200).json({
                    message: "CS 25200 is a prereq for CS 48900, CS 35400, and CS 35200. Remove these classes first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'CS 30700') {
            if (scheduleNamesList.includes('CS 40700')) {
                return res.status(200).json({
                    message: "CS 30700 is a prereq for CS 40700. Remove this class first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'CS 35400') {
            if (scheduleNamesList.includes('CS 42200') || scheduleNamesList.includes('CS 42600')) {
                return res.status(200).json({
                    message: "CS 35400 is a prereq for CS 42200 and CS 42600. Remove these classes first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'CS 35200') {
            if (scheduleNamesList.includes('CS 45600') || scheduleNamesList.includes('CS 35300')) {
                return res.status(200).json({
                    message: "CS 35200 is a prereq for CS 45600 and CS 35300. Remove these classes first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'CS 38100') {
            if (scheduleNamesList.includes('CS 48300')) {
                return res.status(200).json({
                    message: "CS 38100 is a prereq for CS 48300. Remove this class first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }
        else if (className === 'CS 33400') {
            if (scheduleNamesList.includes('CS 43400')) {
                return res.status(200).json({
                    message: "CS 33400 is a prereq for CS 43400. Remove this class first",
                    success: false,
                    coursesToTake: coursesWithCredits,
                    schedule: scheduleWithCredits
                })
            }
        }

        //TODO: classes that are not CS and not math (ex: science)

        //removes class from the schedule
        for (let i = 0; i < scheduleNames.length; i++) {
            if (scheduleNames[i].includes(className)) {
                scheduleNames[i].splice(scheduleNames[i].indexOf(className), 1)
                break
            }
        }

        //adds class back to coursesToTake list
        courseNames.push(className)

        //updates user data on MongoDB
        await User.updateOne({email: req.email}, {schedule: scheduleNames, coursesToTake: courseNames})

        return res.status(200).json({
            message: 'Removed class successfully',
            success: true,
            coursesToTake: coursesWithCredits,
            schedule: scheduleWithCredits
        })
    }
    catch {
        return res.status(400).json({message: "Schedule was not able to be updated"})
    }
}

module.exports.removeOldClass = async(req, res) => {
    //try to remove the class that's not in the semIndex
    try {
        const {semIndex, className} = req.body

        //gets user data from MongoDB
        const user = await User.findOne({email: req.email})

        let scheduleNames = user.schedule

        const db = new sqlite3.Database("classes.db")
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

        //semester index of the duplicate class that needs to be removed
        let removeSemIndex

        for (let iterateSemIndex = 0; iterateSemIndex < scheduleNames.length; iterateSemIndex++) {
            if (scheduleNames[iterateSemIndex].includes(className) && iterateSemIndex !== semIndex) {
                removeSemIndex = iterateSemIndex
            }
        }

        //if the class was moved to an earlier semester, there should not be an issue w/ removing the duplicate
        //if condition below deals with the case in which the class is moved to a later semester
        console.log('remove from sem ', removeSemIndex)
        console.log('add to sem ', semIndex)

        if(removeSemIndex < semIndex) {
            console.log("check for errors")
            if (className === 'MA 16100') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if ((scheduleNames[i].includes('CS 18000') && i !== semIndex) ||
                        scheduleNames[i].includes('CS 18200') ||
                        scheduleNames[i].includes('MA 16200')) {

                        //remove newly added MA 16100
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('MA 16100'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'MA 16100'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "MA 16100 is a prereq for CS 18000 (may be taken concurrently), " +
                                "CS 18200, and MA 16200",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'MA 16200') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if ((scheduleNames[i].includes('STAT 35000')) ||
                        scheduleNames[i].includes('MA 26100')) {

                        //remove newly added MA 16200
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('MA 16200'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'MA 16200'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "MA 16200 is a prereq for STAT 35000 and MA 26100",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'STAT 35000') {

                let MA265Pre = false
                //iterate from index 0 to semIndex at most (index of CS 35500 if comes before)
                for (let i = 0; i < semIndex; i++) {
                    if (scheduleNames[i].includes('CS 35500')) {
                        break
                    }
                    if (scheduleNames[i].includes('MA 26500')) {
                        MA265Pre = true
                    }
                }

                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if ((scheduleNames[i].includes('CS 37300') && i !== semIndex) ||
                        (scheduleNames[i].includes('CS 35500') && !MA265Pre)) {

                        //remove newly added STAT 35000
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('STAT 35000'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'STAT 35000'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "STAT 35000 is a prereq for CS 37300 (may be taken concurrently) and either " +
                                "STAT 35000 or MA 26500 can be used as a prereq for CS 35500",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'MA 26100') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if ((scheduleNames[i].includes('MA 26500') && i !== semIndex) ||
                        scheduleNames[i].includes('CS 38100')) {

                        //remove newly added MA 26100
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('MA 26100'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'MA 26100'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "MA 26100 is a prereq for MA 26500 (may be taken concurrently) " +
                                "and CS 38100",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'MA 26500') {
                let STAT350Pre = false
                //iterate from index 0 to semIndex at most (index of CS 35500 if it comes before)
                for (let i = 0; i < semIndex; i++) {
                    if (scheduleNames[i].includes('CS 35500')) {
                        break
                    }
                    if (scheduleNames[i].includes('STAT 35000')) {
                        STAT350Pre = true
                    }
                }
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if (scheduleNames[i].includes('CS 31400') ||
                        (scheduleNames[i].includes('CS 35500') && !STAT350Pre) ||
                        scheduleNames[i].includes('CS 33400')) {

                        //remove newly added MA 16100
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('MA 26500'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'MA 26500'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "MA 26500 is a prereq for CS 31400 and CS 33400, and either MA 26500 or " +
                                "STAT 35000 can be used as a prereq for CS 35500",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'CS 18000') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if (scheduleNames[i].includes('CS 18200') ||
                        scheduleNames[i].includes('CS 24000') ||
                        scheduleNames[i].includes('CS 31400')) {

                        //remove newly added CS 18000
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('CS 18000'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'CS 18000'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "CS 18000 is a prereq for CS 18200, CS 24000, and CS 31400",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'CS 18200') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if (scheduleNames[i].includes('CS 25100') ||
                        scheduleNames[i].includes('CS 25000')) {

                        //remove newly added CS 18200
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('CS 18200'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'CS 18200'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "CS 18200 is a prereq for CS 25000 and CS 25100",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'CS 24000') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if (scheduleNames[i].includes('CS 25000') ||
                        scheduleNames[i].includes('CS 25100') ||
                        scheduleNames[i].includes('CS 33400')) {

                        //remove newly added CS 24000
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('CS 24000'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'CS 24000'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "CS 24000 is a prereq for CS 25000, CS 25100, and CS 33400",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'CS 25000') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if (scheduleNames[i].includes('CS 25200')) {

                        //remove newly added CS 25000
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('CS 25000'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'CS 25000'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "CS 25000 is a prereq for CS 25200",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'CS 25100') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if (scheduleNames[i].includes('CS 25200') ||
                        scheduleNames[i].includes('CS 40800') ||
                        scheduleNames[i].includes('CS 44800') ||
                        scheduleNames[i].includes('CS 47100') ||
                        scheduleNames[i].includes('CS 47300') ||
                        scheduleNames[i].includes('CS 34800') ||
                        scheduleNames[i].includes('CS 30700') ||
                        scheduleNames[i].includes('CS 35500') ||
                        scheduleNames[i].includes('CS 38100') ||
                        scheduleNames[i].includes('CS 37300')
                        ) {

                        //remove newly added CS 25100
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('CS 25100'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'CS 25100'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "CS 25100 is a prereq for CS 40800, CS 44800, CS 47100, CS 47300, CS 34800, " +
                                "CS 30700, CS 35500, CS 38100, CS 37300",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'CS 25200') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if (scheduleNames[i].includes('CS 48900') ||
                        scheduleNames[i].includes('CS 35400') ||
                        scheduleNames[i].includes('CS 35200')) {

                        //remove newly added CS 25200
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('CS 25200'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'CS 25200'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "CS 25200 is a prereq for CS 48900, CS 35400, CS 35200",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'CS 30700') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if (scheduleNames[i].includes('CS 40700')) {

                        //remove newly added CS 30700
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('CS 30700'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'CS 30700'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "CS 30700 is a prereq for CS 40700",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'CS 35400') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if ((scheduleNames[i].includes('CS 42200') && i !== semIndex) ||
                        (scheduleNames[i].includes('CS 42600') && i !== semIndex)) {

                        //remove newly added CS 35400
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('CS 35400'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'CS 35400'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "CS 35400 is a prereq for CS 42200 (may be taken concurrently) and CS 42600" +
                                " (may be taken concurrently)",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'CS 35200') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if ((scheduleNames[i].includes('CS 45600') && i !== semIndex) ||
                        scheduleNames[i].includes('CS 35300')) {

                        //remove newly added CS 35200
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('CS 35200'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'CS 35200'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "CS 35200 is a prereq for CS 45600 (may be taken concurrently) and CS 35300",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'CS 38100') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if (scheduleNames[i].includes('CS 48300')) {

                        //remove newly added CS 38100
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('CS 38100'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'CS 38100'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "CS 38100 is a prereq for CS 48300",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
            else if (className === 'CS 33400') {
                for (let i = removeSemIndex; i <= semIndex; i++) {
                    if (scheduleNames[i].includes('CS 43400')) {

                        //remove newly added CS 33400
                        scheduleNames[semIndex].splice(scheduleNames[semIndex].indexOf('CS 33400'), 1)
                        scheduleWithCredits[semIndex]
                            .splice(scheduleWithCredits[semIndex].findIndex(course => course.name === 'CS 33400'), 1)
                        await User.updateOne({email: req.email}, {schedule: scheduleNames})

                        return res.status(200).json({
                            message: "CS 33400 is a prereq for CS 43400",
                            success: false,
                            schedule: scheduleWithCredits
                        })
                    }
                }
            }
        }

        console.log('move allowed')
        //update mongodb
        scheduleNames[removeSemIndex].splice(scheduleNames[removeSemIndex].indexOf(className), 1)
        await User.updateOne({email: req.email}, {schedule: scheduleNames})

        //updated schedule w/ credits and return
        for (let i = 0; i < scheduleWithCredits[removeSemIndex].length; i++) {
            if (scheduleWithCredits[removeSemIndex][i].name === className) {
                scheduleWithCredits[removeSemIndex].splice(i, 1)
                break
            }
        }
        return res.status(200).json({
            message: 'Moved class successfully',
            success: true,
            schedule: scheduleWithCredits
        })
    }
    catch {
        return res.status(400).json({message: "There was an unexpected error...unfortunately, you will have to remake your schedule"})
    }
}

/**
 * This function will return any alternatives available for the given course back to the client.
 * It also will get the description for the class
 */
module.exports.getAlternatives = async(req, res) => {
    try {
        const {className} = req.body

        //sqlite database
        const db = new sqlite3.Database("classes.db")

        //gets the description of the class
        let desc = ""
        await new Promise((res, rej) => {
            db.get('SELECT description FROM classesList WHERE class_id = ?',
                [className],
                (err, row) => {
                    desc = row.description
                    res()
                })
        })
        db.close()

        //gets user data from MongoDB
        const user = await User.findOne({email: req.email})

        //checks to see if course is part of a lab sci sequence & gets index of requested class
        const sci_alt = user.sci_alt
        const coursesToTake = user.coursesToTake
        const taken = user.taken
        let seq_index
        let isLab = false
        for (let i = 0; i < sci_alt.length; i++) {
            if (sci_alt[i].includes(className)) {
                let found = true
                for (let j = 0; j < sci_alt[i].length; j++) {
                    if (!coursesToTake.includes(sci_alt[i][j]) && !taken.includes(sci_alt[i][j])) {
                        found = false
                    }
                }
                if (found) {
                    isLab = true
                    seq_index = i
                }
            }
        }

        if (isLab) {
            let sci_alt_credits = []
            const replacements = sci_alt.splice(seq_index, 1)[0]

            //getting credit hours of each lab science course
            const db = new sqlite3.Database("classes.db")
            await new Promise(async (resolve, reject) => {
                for (let i = 0; i < sci_alt.length; i++) {
                    let sequence = []
                    for (let j = 0; j < sci_alt[j].length; j++) {
                        await new Promise((res, rej) => {
                            db.get('SELECT credit_hours FROM classesList WHERE class_id = ?',
                                [sci_alt[i][j]],
                                (err, row) => {
                                    sequence.push({name: sci_alt[i][j], credits: row.credit_hours})
                                    res()
                                })
                        })
                    }
                    sci_alt_credits.push(sequence)
                }
                resolve()
            })
            db.close()

            return res.status(200).json({
                description: desc,
                isSeq: true,
                replacements: replacements,
                alternates: sci_alt_credits
            })
        }

        //checks to see if course is a part of a language sequence
        else {
            const lang_alt = user.lang_alt
            let isLang = false

            for (let i = 0; i < lang_alt.length; i++) {
                if (lang_alt[i].includes(className)) {
                    let found = true
                    for (let j = 0; j < lang_alt[i].length; j++) {
                        if (!coursesToTake.includes(lang_alt[i][j]) && !taken.includes(lang_alt[i][j])) {
                            found = false
                        }
                    }
                    if (found) {
                        isLang = true
                        seq_index = i
                    }
                }
            }

            if (isLang) {

                const replacements = lang_alt.splice(seq_index, 1)[0]

                const lang_alt_credits = []
                //all core lang classes are 3 credits
                for (let i = 0; i < lang_alt.length; i++) {
                    const seq = []
                    for (let j = 0; j < lang_alt[i].length; j++) {
                        seq.push({name: lang_alt[i][j], credits: '3.00'})
                    }
                    lang_alt_credits.push(seq)
                }

                return res.status(200).json({
                    description: desc,
                    isSeq: true,
                    replacements: replacements,
                    alternates: lang_alt_credits
                })
            }
        }





        //arrays that store alternatives
        const core_wc_il = [
            {name: "SCLA 10100", credits: "3.00"},
            {name: "ENGL 10600", credits: "4.00"},
            {name:"ENGL 10800", credits: "3.00"},
            {name: "ENGL 30400", credits: "3.00"}
        ]

        const sts = [
            {name: "EAPS 10000", credits: "3.00"},
            {name: "CS 10100", credits: "3.00"},
            {name: "EAPS 10400", credits: "3.00"},
            {name: "EAPS 10600", credits: "3.00"}
        ]
        const stat = [
            {name: "STAT 35000", credits: "3.00"},
            {name: "STAT 51100", credits: "3.00"}
        ]

        const gis = [
            {name: "EAPS 32700", credits: "3.00"},
            {name: "EAPS 37500", credits: "3.00"},
            {name: "CS 39000", credits: "3.00"}
        ]

        const calc1 = [
            {name: "MA 16100", credits: "5.00"},
            {name: "MA 16500", credits: "4.00"}
        ]

        const calc2 = [
            {name: "MA 16200", credits: "5.00"},
            {name: "MA 16600", credits: "4.00"}
        ]

        const calc3 = [
            {name: "MA 26100", credits: "4.00"},
            {name: "MA 27101", credits: "5.00"}
        ]

        const linear = [
            {name: "MA 26500", credits: "3.00"},
            {name: "MA 35100", credits: "3.00"}
        ]

        const alternativeLists = [core_wc_il, sts, stat, gis, calc1, calc2, calc3, linear]

        //alternatives for course given from user
        let alternates = []

        for (let i = 0; i < alternativeLists.length; i++) {
            for (let j = 0; j < alternativeLists[i].length; j++) {
                if (alternativeLists[i][j].name === className) {
                    alternates = alternativeLists[i]
                    alternates.splice(j, 1)
                }
            }
        }

        return res.status(200).json({
            description: desc,
            isSeq: false,
            alternates: alternates
        })


    }
    catch {
        return res.status(400).json({message: "Unable to get description and/or alternatives"})
    }

}

module.exports.ReplaceClass = async (req, res) => {
    try {
        const {oldClassName, newClassName} = req.body
        console.log("replacing ", oldClassName, " with ", newClassName)

        //gets user data from MongoDB
        const user = await User.findOne({email: req.email})

        let coursesToTake = user.coursesToTake

        coursesToTake.splice(coursesToTake.indexOf(oldClassName), 1)
        coursesToTake.push(newClassName)

        //updates user data on MongoDB
        await User.updateOne({email: req.email}, {coursesToTake: coursesToTake})

        return res.status(200).json({message: "Replaced classes successfully", success: true})
    }
    catch {
        return res.status(400).json({message: "Unable to replace classes", success: false})
    }
}

module.exports.ReplaceSequence = async (req, res)  => {
    try {
        const {oldClassNames, newClassNames} = req.body

        //gets user data from MongoDB
        const user = await User.findOne({email: req.email})

        let coursesToTake = user.coursesToTake

        for (let i = 0; i < oldClassNames.length; i++) {
            console.log('replacing ', oldClassNames[i], ' with ', newClassNames[i])
            coursesToTake.splice(coursesToTake.indexOf(oldClassNames[i]), 1)
            coursesToTake.push(newClassNames[i])
        }

        console.log(coursesToTake)

        //updates user data on MongoDB
        await User.updateOne({email: req.email}, {coursesToTake: coursesToTake})

        return res.status(200).json({message: "Replaced classes successfully", success: true})
    }
    catch {
        return res.status(400).json({message: "Unable to replace classes", success: false})
    }
}
