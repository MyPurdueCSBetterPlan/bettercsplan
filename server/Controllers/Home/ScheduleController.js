const User = require("../../Models/UserModel")

module.exports.AddClass = async (req, res) => {
    try {

        const {semIndex, className} = req.body

        const user = await User.findOne({email: req.email})

        let schedule = user.schedule
        let taken = user.taken
        let coursesToTake = user.coursesToTake


        //array to store all the classes that the user has listed on their schedule for the previous semesters
        let previousSemClasses = []
        for (let i = 0; i < semIndex; i++) {
            previousSemClasses.push(...schedule[i])
        }

        console.log(previousSemClasses)

        const currentSemClasses = schedule[semIndex]

        //prereq checking
        if (className === "CS 18000") {
            if (!taken.includes("MA 16100") && !previousSemClasses.includes("MA 16100") &&
                !currentSemClasses.includes("MA 16100")) {
                return res.status(200).json({
                    message: "MA 16100 must be taken before or concurrently",
                    success: false
                })
            }
        }
        else if (className === "CS 18200" || className === "CS 24000") {
            if (!taken.includes("CS 18000") && !previousSemClasses.includes("CS 18000")) {
                return res.status(200).json({
                    message: "CS 18000 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "CS 25000" || className === "CS 25100") {
            if ((!taken.includes("CS 24000") && !previousSemClasses.includes("CS 24000")) ||
                (!taken.includes("CS 18200") && !previousSemClasses.includes("CS 18200"))) {
                return res.status(200).json({
                    message: "CS 24000 and CS 18200 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "CS 25200") {
            if ((!taken.includes("CS 25000") && !previousSemClasses.includes("CS 25000")) ||
                (!taken.includes("CS 25100") && !previousSemClasses.includes("CS 25100"))) {
                return res.status(200).json({
                    message: "CS 25000 and CS 25100 must be taken before",
                    success: false,
                    coursesToTake: coursesToTake})
            }
        }
        else if (className === "CS 40800" || className === "CS 44800" || className === "CS 47100" ||
                 className === "CS 47300" || className === "CS 34800" || className === "CS 30700") {
            if (!taken.includes("CS 25100") && !previousSemClasses.includes("CS 25100")) {
                return res.status(200).json({
                    message: "CS 25100 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "CS 40700") {
            if (!taken.includes("CS 30700") && !previousSemClasses.includes("CS 30700")) {
                return res.status(200).json({
                    message: "CS 30700 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "CS 48900" || className === "CS 35400" || className === "CS 35200") {
            if (!taken.includes("CS 25200") && !previousSemClasses.includes("CS 25200")) {
                return res.status(200).json({
                    message: "CS 25200 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "CS 42200" || className === "CS 42600") {
            if (!taken.includes("CS 35400") && !previousSemClasses.includes("CS 35400") &&
                !currentSemClasses.includes("CS 35400")) {
                return res.status(200).json({
                    message: "CS 35400 must be taken before or concurrently",
                    success: false
                })
            }
        }
        else if (className === "CS 45600") {
            if (!taken.includes("CS 35200") && !previousSemClasses.includes("CS 35200") &&
                !classNames.includes("CS 35200")) {
                return res.status(200).json({
                    message: "CS 35200 must be taken before or concurrently",
                    success: false
                })
            }
        }
        else if (className === "CS 35300") {
            if (!taken.includes("CS 35200") && !previousSemClasses.includes("CS 35200")) {
                return res.status(200).json({
                    message: "CS 35200 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "MA 16200") {
            if (!taken.includes("MA 16100") && !previousSemClasses.includes("MA 16100") &&
                !currentSemClasses.includes("MA 16100")) {
                return res.status(200).json({
                    message: "MA 16100 must be taken before or concurrently",
                    success: false
                })
            }
        }
        else if (className === "STAT 35000" || className === "MA 26100") {
            if (!taken.includes("MA 16200") && !previousSemClasses.includes("MA 16200")) {
                return res.status(200).json({
                    message: "MA 162 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "MA 26500") {
            if (!taken.includes("MA 26100") && !previousSemClasses.includes("MA 26100") &&
                !currentSemClasses.includes("MA 26100")) {
                return res.status(200).json({
                    message: "MA 26100 must be taken before",
                    success: false
                })
            }
        }
        else if (className.includes("CS 37300")) {
            if ((!taken.includes("CS 25100") && !previousSemClasses.includes("CS 25100")) ||
                (!taken.includes("STAT 35000") && !previousSemClasses.includes("STAT 35000") &&
                 !currentSemClasses.includes("STAT 35000"))) {
                return res.status(200).json({
                    message: "CS 25100 must be taken before and STAT 35000 must be taken before or concurrently",
                    success: false
                })
            }
        }
        else if (className === "CS 38100") {
            if ((!taken.includes("CS 25100") && !previousSemClasses.includes("CS 25100")) ||
                (!taken.includes("MA 26100") && !previousSemClasses.includes("MA 26100"))) {
                return res.status(200).json({
                    message: "CS 25100 and MA 26100 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "CS 48300") {
            if (!taken.includes("CS 38100") && !previousSemClasses.includes("CS 38100")) {
                return res.status(200).json({
                    message: "CS 38100 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "CS 31400") {
            if ((!taken.includes("CS 18000") && !previousSemClasses.includes("CS 18000")) ||
                (!taken.includes("MA 26500") && !previousSemClasses.includes("MA 26500"))) {
                return res.status(200).json({
                    message: "CS 18000 and MA 26500 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "CS 35500") {
            if ((!taken.includes("CS 25100") && !previousSemClasses.includes("CS 25100")) ||
                (!taken.includes("STAT 35000") && !previousSemClasses.includes("STAT 35000") &&
                 !taken.includes("MA 26500") && !previousSemClasses.includes("MA 26500"))) {
                return res.status(200).json({
                    message: "CS 25100 must be taken before and either STAT 35000 or MA 26500 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "CS 33400") {
            if ((!taken.includes("CS 24000") && !previousSemClasses.includes("CS 24000")) ||
                (!taken.includes("MA 26500") && !previousSemClasses.includes("MA 26500"))) {
                return res.status(200).json({
                    message: "CS 24000 and MA 26500 must be taken before",
                    success: false
                })
            }
        }
        else if (className === "CS 43400") {
            if (!taken.includes("CS 33400") && !previousSemClasses.includes("CS 33400")) {
                return res.status(200).json({
                    message: "CS 3340 must be taken before",
                    success: false
                })
            }
        }

        //updating semester classes
        currentSemClasses.push(className)
        schedule[semIndex] = currentSemClasses

        //updating coursesToTake
        coursesToTake.splice(coursesToTake.indexOf(className), 1)


        await User.updateOne({email: req.email}, {schedule: schedule, coursesToTake: coursesToTake})
        return res.status(200).json({message: "Successfully updated schedule",
                                     success: true
        })
    }
    catch {
        return res.status(400).json("Schedule was not able to be updated")
    }
}

module.exports.RemoveClass = async (req, res) => {
    try {

        const {className} = req.body

        const user = await User.findOne({email: req.email})

        let schedule = user.schedule
        let coursesToTake = user.coursesToTake
        for (let i = 0; i < schedule.length; i++) {
            if (schedule[i].includes(className)) {
                schedule[i].splice(schedule[i].indexOf(className), 1)
                break
            }
        }
        coursesToTake.push(className)
        await User.updateOne({email: req.email}, {schedule: schedule, coursesToTake: coursesToTake})
        return res.status(200).json({message: "schedule was successfully updated", success: true})
    }
    catch {
        return res.status(400).json({message: "Schedule was not able to be updated", success: false})
    }
}