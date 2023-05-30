/*
 * CreateController.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const User = require("../../Models/UserModel")
const Track = require("../../Models/TrackModel")
const sqlite3 = require('sqlite3')

//returns a "hit" list that encompasses both required and elective courses
function getHitList(trackObjects) {
    //makes the elective "hit" list
    let classHits = {}
    for (let i = 0; i < trackObjects.length; i++) {
        let trackReqs = trackObjects[i].required
        let trackElect = trackObjects[i].elective

        //used to keep track of "hit" classes to not double count them when looking at electives after required
        let alreadyHit = []

        //iterating through required (assumed to be all or conditions)
        for (let j = 0; j < trackReqs.length; j++) {
            for (let k = 0; k < trackReqs[j].length; k++) {
                if (!classHits.hasOwnProperty(trackReqs[j][k])) {
                    classHits[trackReqs[j][k]] = 1
                }
                else {
                    classHits[trackReqs[j][k]] += 1
                }
                alreadyHit.push(trackReqs[j][k])
            }
        }

        //iterating through electives
        for (let j = 0; j < trackElect.length; j++) {
            //for or conditions, adds one to each elective's "hit" count
            if (Array.isArray(trackElect[j])) {
                for (let k = 0; k < trackElect[j].length; k++) {
                    if (!classHits.hasOwnProperty(trackElect[j][k]) && !alreadyHit.includes(trackElect[j][k])) {
                        classHits[trackElect[j][k]] = 1
                    }
                    else if (!alreadyHit.includes(trackElect[j][k])){
                        classHits[trackElect[j][k]] += 1
                    }
                }
            }
            else {
                if (!classHits.hasOwnProperty(trackElect[j]) && !alreadyHit.includes(trackElect[j])) {
                    classHits[trackElect[j]] = 1
                }
                else if (!alreadyHit.includes(trackElect[j])) {
                    classHits[trackElect[j]] += 1
                }
            }
        }
    }
    return classHits
}

//returns a hit list that encompasses only required courses (required courses are assumed to be all OR conditions)
function getRequiredHitList(trackObjects) {
    let classHits = {}
    for (let i = 0; i < trackObjects.length; i++) {
        let trackReqs = trackObjects[i].required
        for (let j = 0; j < trackReqs.length; j++) {
            for (let k = 0; k < trackReqs[j].length; k++) {
                if (!classHits.hasOwnProperty(trackReqs[j][k])) {
                    classHits[trackReqs[j][k]] = 1
                }
                else {
                    classHits[trackReqs[j][k]] += 1
                }
            }
        }
    }
    return classHits
}

function updateRequired(trackObjects, classesTaken, coursesToTake) {
    for (let i = 0; i < trackObjects.length; i++) {
        let trackReqs = trackObjects[i].required
        let trackElect = trackObjects[i].elective
        for (let j = 0; j < trackReqs.length; j++) {
            for (let k = 0; k < trackReqs[j].length; k++) {
                if (classesTaken.includes(trackReqs[j][k]) || coursesToTake.includes(trackReqs[j][k])) {
                    //user has already taken one or one is already in coursesToTake ->
                    // remove from required & elective array
                    const name = trackReqs[j][k]
                    const index = trackElect.indexOf(name)
                    if (index !== -1) {
                        trackElect.splice(index, 1)
                    }
                    trackReqs.splice(j, 1)

                    //also remove from all other track's elective arrays and update their choose counts
                    for (let l = 0; l < trackObjects.length; l++) {
                        let trackElect2 = trackObjects[l].elective
                        for (let m = 0; m < trackElect2.length; m++) {
                            if (Array.isArray(trackElect2[m]) && trackElect2[m].includes(name)) {
                                trackElect2.splice(m, 1)
                                trackObjects[l].choose -= 1
                                m--
                            }
                            else if (trackElect2[m] === name) {
                                trackElect2.splice(m, 1)
                                trackObjects[l].choose -= 1
                                m--
                            }
                        }
                    }

                    //break goes to next or condition
                    break
                }
            }
        }
    }
}

//sets a user's tracks
module.exports.setTracks = async (req, res) => {
    const email = req.email
    const {tracks} = req.body

    try {
        await User.updateOne({email: email}, {tracks: tracks})
        return res.status(200).json()
    } catch {
        return res.status(400).json()
    }
}

//gives a list of all classes back to the client
module.exports.getClasses = async (req, res) => {
    try {
        const {filter} = req.body
        const db = new sqlite3.Database("classes.db")
        await db.all("SELECT class_id FROM classesList WHERE class_id LIKE ?", ['%' + filter + '%'], (err, rows) => {
                if(err) {
                    db.close()
                    return res.status(400).json()
                }
                if(rows) {
                    db.close()
                    const classes = rows.map(obj => obj.class_id)
                    return res.status(200).json({classes: classes})
                }
        })
    } catch {
        return res.status(400).json()
    }
}

//sets a user's already taken classes
module.exports.setTaken = async (req, res) => {
    const email = req.email
    const {classes} = req.body
    try {
        await User.updateOne({email: email}, {taken: classes})
        return res.status(200).json()
    } catch {
        return res.status(400).json()
    }
}

//sets options for the user (years to graduate and summer classes)
module.exports.setOptions = async (req, res) => {
    const email = req.email
    const {years, summer} = req.body
    try {
        await User.updateOne({email: email}, {years: years, openToSummer: summer})
        return res.status(200).json()
    } catch {
        return res.status(400).json()
    }
}

//generates a user's schedule
module.exports.coreSciAdd = async (req, res, next) => {

    //finds the user
    const email = req.email
    let user
    try {
        user = await User.findOne({email: email})
    } catch {
        return res.status(400).json()
    }

    //array to store all classes user must take in the future
    let coursesToTake = []

    //variables to track requirements
    let core_wc = false
    let core_il = false
    let core_oc = false
    //let core_sci = false (unnecessary b/c College of Science lab science requirement meets this)
    let core_sts = false

    //let core_mqr = false (unnecessary b/c College of Science math requirement meets this)
    let core_hum = false
    let core_bss = false
    let sci_tw = false
    let sci_tp = false

    /*
    culture and language requirement can be met in three ways but only 2 do not require advisor approval:
    1. 3 language courses
    2. 2 language courses and 1 culture course
     */
    let sci_cult = []
    let sci_lang = []

    /*
    lab science requirement met by completion of two/three course sequence:
    BIOL 11000 + BIOL 11100
    BIOL 12100 + BIOL 13100 + BIOL 13500
    CHM 11500 + (CHM 11600 or CHM 12901)
    CHM 12500 + CHM 12600
    EAPS 11100 + EAPS 11200
    PHYS 17200 + PHYS 27200
    PHYS 17200 + PHYS 24100 + PHYS 25200
    PHYS 17200 + PHYS 22100
    PHYS 22000 + PHYS 22100
    PHYS 23300 + PHYS 23400
     */
    let biol1 = {
        "BIOL 11000": false,
        "BIOL 11100": false
    }
    let biol2 = {
        "BIOL 12100": false,
        "BIOL 13100": false,
        "BIOL 13500": false
    }
    let chm1 = {
        "CHM 11500": false,
        "CHM 11600": false
    }
    let chm2 = {
        "CHM 11500": false,
        "CHM 12901": false
    }
    let chm3 = {
        "CHM 12500": false,
        "CHM 12600": false
    }
    let eaps = {
        "EAPS 11100": false,
        "EAPS 11200": false
    }
    let phys1 = {
        "PHYS 17200": false,
        "PHYS 27200": false
    }
    let phys2 = {
        "PHYS 17200": false,
        "PHYS 24100": false,
        "PHYS 25200": false
    }
    let phys3 = {
        "PHYS 17200": false,
        "PHYS 22100": false
    }
    let phys4 = {
        "PHYS 22000": false,
        "PHYS 22100": false
    }
    let phys5 = {
        "PHYS 23300": false,
        "PHYS 23400": false
    }
    let sci_lab = [biol1, biol2, chm1, chm2, chm3, eaps, phys1, phys2, phys3, phys4, phys5]

    //let sci_math = [] will take care of math when considering cs requirements

    //STAT 35000 or STAT 51100
    let sci_stat = false

    let sci_sts = false
    let sci_gis = false

    //gen-ed requirement met by three courses from the gen-ed list
    let sci_gen = []

    const db = new sqlite3.Database("classes.db")

    //gets the classes the user has already taken
    const classesTaken = user.taken

    //iterates through already taken classes to see what requirements user has already met
    for (let i = 0; i < classesTaken.length; i++) {

        //core and college of science requirements
        await new Promise((resolve, reject) => {
            db.get(
                "SELECT core_wc, core_il, core_oc, core_sci, core_sts, core_mqr, core_hum, core_bss, " +
                "sci_tw, sci_tp, sci_lang, sci_lab, sci_math, sci_stat, sci_sts, sci_gis, sci_gen FROM classesList WHERE " +
                "class_id = ?",
                [classesTaken[i]],
                (err, row) => {
                    if (row.core_wc === "T") {
                        core_wc = true
                    }
                    if (row.core_il === "T") {
                        core_il = true
                    }
                    if (row.core_oc === "T") {
                        core_oc = true
                    }
                    if (row.core_sts === "T") {
                        core_sts = true
                    }
                    /*
                    if (row.core_mqr === "T") {
                        core_mqr = true
                    }
                     */
                    if (row.core_hum === "T") {
                        core_hum = true
                    }
                    if (row.core_bss === "T") {
                        core_bss = true
                    }
                    if (row.sci_tw === "T") {
                        sci_tw = true
                    }
                    if (row.sci_tp === "T") {
                        sci_tp = true
                    }
                    if (row.sci_lang === "F T") {
                        sci_cult.push(classesTaken[i])
                    }
                    if (row.sci_lang === "T F") {
                        sci_lang.push(classesTaken[i])
                    }
                    if (row.sci_lab === "T") {
                        // if the sequence has the class, sets that class property to true
                        sci_lab.forEach(sequence => {
                            if (sequence.hasOwnProperty(classesTaken[i])) {
                                sequence[classesTaken[i]] = true
                            }
                        })
                    }
                    if (row.sci_stat === "T") {
                        sci_stat = true
                    }
                    if (row.sci_sts === "T") {
                        sci_sts = true
                    }
                    if (row.sci_gis === "T") {
                        sci_gis = true
                    }
                    if (row.gen_ed === "T") {
                        sci_gen.push(classesTaken[i])
                    }
                    resolve()
                }
            )
        })
    }

    //adding courses to meet core requirements
    if (!core_wc || !core_il) {
        coursesToTake.push("SCLA 10100")
    }
    if (!core_oc || !sci_tp || !sci_tw) {
        coursesToTake.push("COM 21700")
    }
    if (!core_sts || !sci_sts) {
        coursesToTake.push("EAPS 10600")
    }
    if (!core_bss) {
        coursesToTake.push("POL 13000")
        //POL 13000 also meets gen ed
        sci_gen.push("POL 13000")
    }
    if (!core_hum) {
        coursesToTake.push("PHIL 11000")
        //PHIL 11000 also meets gen ed
        sci_gen.push("PHIL 11000")
    }
    //checks if there exists a lab science sequence where all the classes are met
    let meet_sci_lab = false
    sci_lab.forEach(sequence => {
        if (Object.values(sequence).every(value => (value === true))) {
            meet_sci_lab = true
        }
    })

    // if lab req is not met, sees if there are any sequences where only one class is needed to complete
    // Otherwise, just adds eaps 11100 and eaps 11200 because they are easy lmao
    if (!meet_sci_lab) {
        let added = false
        for (let i = 0; i < sci_lab.length; i++) {
            const sequenceArr = Object.entries(sci_lab[i])
            let falseCount = 0
            let addClass
            for (let j = 0; j < sequenceArr.length; j++) {
                if (sequenceArr[j][1] === false) {
                    falseCount++
                    addClass = sequenceArr[j][0]
                }
            }
            if (falseCount === 1) {
                coursesToTake.push(addClass)
                added = true
                break
            }
        }
        if (!added) {
            coursesToTake.push("EAPS 11100")
            coursesToTake.push("EAPS 11200")
        }
    }
    if (!sci_stat) {
        coursesToTake.push("STAT 35000")
    }
    if (!sci_gis) {
        coursesToTake.push("EAPS 32700")
    }
    const easy_gen = ["PSY 12000", "PHIL 11000", "HIST 10300"]
    if (sci_gen.length < 3) {
        let numNeeded = 3 - sci_gen.length
        let index = 0
        while (numNeeded !== 0) {
            if (!sci_gen.includes(easy_gen[index])) {
                coursesToTake.push(easy_gen[index])
                numNeeded--
            }
            index++
        }
    }

    //deals with the fact that gen eds cannot also count for lang/cult
    else {
        let gen_lang_cult_overlap = 0
        for (let i = 0; i < sci_gen.length; i++) {
            if (sci_lang.includes(sci_gen[i]) || sci_cult.includes(sci_gen[i])) {
                gen_lang_cult_overlap++
            }
        }
        let unique_gen = sci_gen.length - gen_lang_cult_overlap
        let index = 0
        while (unique_gen !== 3) {
            if (sci_lang.includes(sci_gen[index])) {
                sci_lang.splice(index, index)
                unique_gen++
            }
            if (sci_cult.includes(sci_gen[index])) {
                sci_cult.splice(index, index)
                unique_gen++
            }
            index++
        }
    }

    //do language and culture last
    let language_count = {}
    for (let i = 0; i < sci_lang.length; i++) {
        const language = sci_lang[i].split(" ")[0]
        if (!language_count.hasOwnProperty(language)) {
            language_count[language] = 1
        } else {
            language_count[language]++
        }
    }
    const num_lang = Math.max(...Object.values(language_count))
    console.log("max: ", num_lang)
    if (num_lang < 3 && (num_lang !== 2 || sci_cult.length < 1))
        if (sci_cult.length === 1 && sci_lang.length === 1) {
            //one lang - assumes that the first language class taken has number 10100
            const prefix = sci_lang[0].split(" ")[0]
            coursesToTake.push(prefix + "10200")
        }
        else if (sci_cult.length >= 1) {
            //any two lang
            coursesToTake.push("SPAN 10100")
            coursesToTake.push("SPAN 10200")
        }
        else if (sci_lang.length === 1 && sci_cult.length === 0) {
            //two lang same as one already taken - assumes first language class taken is 10100
            const prefix = sci_lang[0].split(" ")[0]
            coursesToTake.push(prefix + "10200")
            coursesToTake.push(prefix + "20100")
        }
        else { //sci_cult.length === 0 && sci_lang.length === 0
            //three lang
            console.log(sci_cult.length)
            console.log(sci_lang.length)
            coursesToTake.push("SPAN 10100")
            coursesToTake.push("SPAN 10200")
            coursesToTake.push("SPAN 20100")
        }

    await User.updateOne({email: email}, {schedule: coursesToTake})
    next()
}

module.exports.csAdd = async (req, res) => {

    //finds the user
    const email = req.email
    let user
    try {
        user = await User.findOne({email: email})
    } catch {
        return res.status(400).json()
    }

    //gets the classes the user has already taken
    const classesTaken = user.taken

    //tracks user selected
    const tracks = user.tracks

    let coursesToTake = []

    //cs math requirements
    let calc1 = false
    let calc2 = false
    let calc3 = false
    let linear = false
    for (let i = 0; i < classesTaken.length; i++) {
        if (classesTaken[i] === "MA 16100" || classesTaken[i] === "MA 16500") {
            calc1 = true
        }
        else if (classesTaken[i] === "MA 16200" || classesTaken[i] === "MA 16600") {
            calc2 = true
        }
        else if (classesTaken[i] === "MA 26100" || classesTaken[i] === "MA 27101") {
            calc3 = true
        }
        else if (classesTaken[i] === "MA 26500" || classesTaken[i] === "MA 35100") {
            linear = true
        }
    }

    //adding cs math requirements
    if (!calc1) {
        coursesToTake.push("MA 16100")
    }
    if (!calc2) {
        coursesToTake.push("MA 16200")
    }
    if (!calc3) {
        coursesToTake.push("MA 26100")
    }
    if (!linear) {
        coursesToTake.push("MA 26500")
    }

    let trackObjects = []

    //gets the tracks from mongodb and turns them into objects
    for (let i = 0; i < tracks.length; i++) {
        const trackObject = await Track.findOne({name: tracks[i]})
        trackObjects.push(trackObject)
    }

    //gets all the required classes WITHOUT AN OR CONDITION, adds them to coursesToTake if user has not taken them
    //and removes them from the required array
    for (let i = 0; i < trackObjects.length; i++) {
        const reqCount = trackObjects[i].required.length
        let trackReqs = trackObjects[i].required
        for (let j = reqCount - 1; j >= 0; j--) {
            if (!Array.isArray(trackReqs[j])) {
                if (!classesTaken.includes(trackReqs[j]) && !coursesToTake.includes(trackReqs[j])) {
                    coursesToTake.push(trackReqs[j])
                }
                trackReqs.splice(j, 1)
            }
        }
    }

    //updates the elective courses and choose count accordingly with the newly added required courses
    for (let i = 0; i < trackObjects.length; i++) {
        let trackElect = trackObjects[i].elective
        for (let j = 0; j < trackElect.length; j++) {

            //if elective is an array (or condition), looks through array to see if it contains a course in
            //"coursesToTake" and also if the person has already taken any of the classes in the array
            //removes from elective list and decrements choose count if so
            if (Array.isArray(trackElect[j])) {
                for (let k = 0; k < trackElect[j].length; k++) {
                    if (coursesToTake.includes(trackElect[j][k]) || classesTaken.includes(trackElect[j][k])) {
                        trackElect.splice(j, 1)
                        trackObjects[i].choose = trackObjects[i].choose - 1
                        j--
                        break
                    }
                }
            }

            //normal elective, if course is in "coursesToTake" or user has already taken the class,
            //removes from elective list and decrements choose count
            if (coursesToTake.includes(trackElect[j]) || classesTaken.includes(trackElect[j])) {
                console.log(trackElect[j])
                trackElect.splice(j, 1)
                trackObjects[i].choose = trackObjects[i].choose - 1
                j--
            }
        }
    }

    //iterates through the OR conditions in the required array
    //removes any unnecessary OR conditions:
    //user has already taken one of the classes or one is already in the list of classes to take
    updateRequired(trackObjects, classesTaken, coursesToTake)

    //iterate through required arrays and choose remaining or conditions based on highest # of class hits
    for (let i = 0; i < trackObjects.length; i++) {
        let trackReqs = trackObjects[i].required
        for (let j = 0; j < trackReqs.length; j++) {
            const classHits = getHitList(trackObjects)

            //finding the class to choose within the OR condition
            let highestHits = 0
            let choose = ""
            for (let k = 0; k < trackReqs[j].length; k++) {
                const hits = classHits[trackReqs[j][k]]
                if (hits > highestHits) {
                    highestHits = hits
                    choose = trackReqs[j][k]
                }

                //when hits are the same, you want to choose the class that "hits" the most required OR conditions
                else if (hits === highestHits) {
                    const challenger = trackReqs[j][k]
                    const reqHits = getRequiredHitList(trackObjects)
                    if (reqHits[challenger] > reqHits[choose]) {
                        choose = challenger
                    }
                }
            }

            //adding to list of courses to take and updating track objects
            coursesToTake.push(choose)
            updateRequired(trackObjects, classesTaken, coursesToTake)
        }
    }

    //pick electives
    //NEED TO CONSIDER PREREQS BECAUSE PREREQS MAY ADD 1 ADDITIONAL CLASS

    console.log("classes to take: ", coursesToTake)
    console.log("track objects: ", trackObjects)
}