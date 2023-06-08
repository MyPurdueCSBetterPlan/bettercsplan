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
 *
 */
module.exports.AddClass = async (req, res) => {
    try {
        const {semIndex, className} = req.body

        //gets user data from MongoDB
        const user = await User.findOne({email: req.email})


        //TODO: this is duplicated code from HomeController.js...maybe find a way to reuse instead of copy/paste
        const db = new sqlite3.Database("classes.db")

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

        let schedule = user.schedule
        let taken = user.taken
        let coursesToTake = user.coursesToTake

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
                    message: "MA 26100 must be taken before",
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
        return res.status(200).json({
            message: "Successfully updated schedule",
            success: true
        })
    }
    catch {
        return res.status(400).json({
            message: "Something went wrong while trying to update your schedule",
            success: true
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

        let schedule = user.schedule
        let coursesToTake = user.coursesToTake

        //removes class from the schedule
        for (let i = 0; i < schedule.length; i++) {
            if (schedule[i].includes(className)) {
                schedule[i].splice(schedule[i].indexOf(className), 1)
                break
            }
        }

        //adds class back to coursesToTake list
        coursesToTake.push(className)

        //updates user data on MongoDB
        await User.updateOne({email: req.email}, {schedule: schedule, coursesToTake: coursesToTake})

        return res.status(200).json({message: "schedule was successfully updated", success: true})
    }
    catch {
        return res.status(400).json({message: "Schedule was not able to be updated", success: false})
    }
}

/**
 * This function will return any alternatives available for the given course back to the client
 */
module.exports.getAlternatives = async(req, res) => {
    try {
        const {className} = req.body

        //gets user data from MongoDB
        const user = await User.findOne({email: req.email})

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
            {name: "EAPS 10400", creidts: "3.00"}
        ]
        const stat = [
            {name: "STAT 35000", credits: "3.00"},
            {name: "STAT 51100", credits: "3.00"}
        ]
        const alternativeLists = [core_wc_il, sts, stat]

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
        console.log(alternates)

        return res.status(200).json({
            alternates: alternates,
            success: true
        })


    }
    catch {
        return res.status(400).json({message: "Unable to get alternatives", success: false})
    }

}

module.exports.ReplaceClass = async (req, res) => {
    try {
        const {oldClassName, newClassName} = req.body

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
