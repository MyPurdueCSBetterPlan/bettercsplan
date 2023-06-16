const User = require("../../Models/UserModel")
const Track = require("../../Models/TrackModel")
const sqlite3 = require('sqlite3')

/**
 * This function returns a "hit" list that encompasses both required and elective courses for certain cs tracks
 *
 * The "hit" list is an object whose properties are class names. The values that the properties have represents
 * the number of conditions ("hits") it fulfills (for example: if the user selects the SWE and ML track, then CS381 would
 * have a value of 2 because CS 381 is a required course for both the SWE and ML tracks). Note that if a class
 * counts as an elective course for a track, that also counts as a "hit".
 *
 * @param trackObjects - array of objects storing information for user's selected tracks
 * @returns {{}} - "hit" list as an object
 *
 */
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
                } else {
                    classHits[trackReqs[j][k]] += 1
                }
                alreadyHit.push(trackReqs[j][k])
            }
        }

        //iterating through electives ONLY if the choose count is > 0
        if (trackObjects[i].choose > 0) {
            for (let j = 0; j < trackElect.length; j++) {
                //for or conditions, adds one to each elective's "hit" count
                if (Array.isArray(trackElect[j])) {
                    for (let k = 0; k < trackElect[j].length; k++) {
                        if (!classHits.hasOwnProperty(trackElect[j][k]) && !alreadyHit.includes(trackElect[j][k])) {
                            classHits[trackElect[j][k]] = 1
                        } else if (!alreadyHit.includes(trackElect[j][k])) {
                            classHits[trackElect[j][k]] += 1
                        }
                    }
                } else {
                    if (!classHits.hasOwnProperty(trackElect[j]) && !alreadyHit.includes(trackElect[j])) {
                        classHits[trackElect[j]] = 1
                    } else if (!alreadyHit.includes(trackElect[j])) {
                        classHits[trackElect[j]] += 1
                    }
                }
            }
        }
    }
    return classHits
}

/**
 * This function serves the same purpose as the getHitList() function except that if a CS course counts for an elective
 * course for a CS track, this does not count as a "hit". Thus, the only "hits" are when a CS course counts for a
 * required course for a CS track.
 *
 * NOTE: required courses are assumed to be all OR conditions. This means that each entry in a track object's
 * required array will be an array itself
 *
 * @param trackObjects - array of objects storing information for user's selected tracks.
 * @returns {{}} - "hit" list encompassing only required courses
 */
function getRequiredHitList(trackObjects) {
    let classHits = {}
    for (let i = 0; i < trackObjects.length; i++) {
        let trackReqs = trackObjects[i].required
        for (let j = 0; j < trackReqs.length; j++) {
            for (let k = 0; k < trackReqs[j].length; k++) {
                if (!classHits.hasOwnProperty(trackReqs[j][k])) {
                    classHits[trackReqs[j][k]] = 1
                } else {
                    classHits[trackReqs[j][k]] += 1
                }
            }
        }
    }
    return classHits
}

/**
 * For each track object in trackObjects, this function removes any required courses in the track object's required
 * array that have either already been taken or that the user will take in the future (in the coursesToTake array).
 * Upon removal, if the removed course is also listed as an elective course for the same track, it is removed
 * from the elective array without updating the choose count because no course can count for both a required
 * and elective course for the same CS track.
 * Then, the function iterates again through all the track objects, but this time, it removes any elective courses
 * in the track object's elective array that have either already been taken or that the user will take in the future.
 * Upon removal, the choose count (# of electives left to pick from the track) in the track object is decremented
 *
 * NOTE: this function expects that each track object's required array consists only of arrays
 * (meaning only OR conditions)
 *
 * @param trackObjects - array of objects storing information for user's selected tracks.
 * @param classesTaken - array of class names that the user has already taken
 * @param coursesToTake - array of class names that the user will take
 */
function updateTracks(trackObjects, classesTaken, coursesToTake) {
    for (let i = 0; i < trackObjects.length; i++) {
        let trackReqs = trackObjects[i].required
        let trackElect = trackObjects[i].elective

        //course in trackReqs found in classesTaken or coursesToTake ->
        //remove entire OR condition from trackReqs + remove course from trackElect
        for (let j = 0; j < trackReqs.length; j++) {
            for (let k = 0; k < trackReqs[j].length; k++) {
                if (classesTaken.includes(trackReqs[j][k]) || coursesToTake.includes(trackReqs[j][k])) {
                    const name = trackReqs[j][k]

                    //removing from elective array
                    for (let l = 0; l < trackElect.length; l++) {
                        if (Array.isArray(trackElect[l])) {
                            for (let m = 0; m < trackElect[l].length; m++) {
                                if (trackElect[l][m] === name) {
                                    trackElect[l].splice(m, 1)
                                }
                            }
                        } else {
                            if (trackElect[l] === name) {
                                trackElect.splice(l, 1)
                            }
                        }
                    }

                    //removing from required array
                    trackReqs.splice(j, 1)
                    j--

                    //break goes to next or condition
                    break
                }
            }
        }
    }

    for (let i = 0; i < trackObjects.length; i++) {
        let trackElect = trackObjects[i].elective

        //course in trackElect found in classesTaken or coursesToTake ->
        //if course is in or condition, remove entire or condition; otherwise just remove the course
        //decrement the elective choose count
        for (let j = 0; j < trackElect.length; j++) {
            if (Array.isArray(trackElect[j])) {
                for (let k = 0; k < trackElect[j].length; k++) {
                    if (coursesToTake.includes(trackElect[j][k]) || classesTaken.includes(trackElect[j][k])) {
                        trackElect.splice(j, 1)
                        trackObjects[i].choose -= 1
                        j--
                        break
                    }
                }
            } else if (coursesToTake.includes(trackElect[j]) || classesTaken.includes(trackElect[j])) {
                trackElect.splice(j, 1)
                trackObjects[i].choose -= 1
                j--
            }
        }
    }
}

/**
 *
 * This function updates the prereqs object when a prereq has been fulfilled (the prereq is either in the
 * coursesToTake array or in the classesTaken array). This is done by removing the property and value of
 * the class whose prereq is now fulfilled.
 *
 * @param prereqs - object whose properties are classes with a prereq (beyond cs core and math) and
 *                  whose values are the prereqs (there should only be one)
 * @param coursesToTake - array of courses that the user will take in the future
 * @param classesTaken - array of courses that the user has already taken
 */
function updatePreReqs(prereqs, coursesToTake, classesTaken) {
    for (const upperClass in prereqs) {
        if (coursesToTake.includes(prereqs[upperClass]) || classesTaken.includes(prereqs[upperClass])) {
            delete prereqs[upperClass]
        }
    }
}

/**
 * This function updates the given user's tracks in mongodb based on the request from the client
 *
 * @param req - incoming request from the client to the server
 * @param res - outgoing response from the server to the client
 * @return {Promise<*>} - sends either a status 200 or status 400 to the client based on success/failure
 */
module.exports.setTracks = async (req, res) => {
    const email = req.email
    const {tracks} = req.body

    try {
        await User.updateOne({email: email}, {tracks: tracks})
        return res.status(200).json()
    } catch {
        return res.status(400).json({message: "Could not update your tracks"})
    }
}

/**
 * This function gets a list of all classes in the sqlite3 database containing all class data that match the
 * filter string given by the client and returns that list back to the client
 *
 * @param req - incoming request from the client to the server
 * @param res - outgoing response from the server to the client
 * @return {Promise<*>} - sends either a status 200 or status 400 to the client based on success/failure
 */
module.exports.getClasses = async (req, res) => {
    try {
        const {filter} = req.body
        const db = new sqlite3.Database("classes.db")
        await db.all("SELECT class_id FROM classesList WHERE class_id LIKE ?", ['%' + filter + '%'], (err, rows) => {
            if (err) {
                db.close()
                return res.status(400).json({message: "Could not get classes"})
            }
            if (rows) {
                db.close()
                const classes = rows.map(obj => obj.class_id)
                return res.status(200).json({classes: classes})
            }
        })
    } catch {
        return res.status(400).json({message: "Could not get classes"})
    }
}

/**
 * This function updates the user's taken array (array of classes that the user has already taken) in mongodb
 *
 * @param req - incoming request from the client to the server
 * @param res - outgoing response from the server to the client
 * @return {Promise<*>} - sends either a status 200 or status 400 back to the client based on success/failure
 */
module.exports.setTaken = async (req, res) => {
    const email = req.email
    const {classes} = req.body
    try {
        await User.updateOne({email: email}, {taken: classes})
        return res.status(200).json()
    } catch {
        return res.status(400).json({message: "Taken classes could not be saved"})
    }
}

/**
 * This function updates the user's "years" and "openToSummer" values in mongodb.
 * "years" refers to the # of years that the user plans to graduate in, and
 * openToSummer refers to whether or not the user is open to summer classes
 *
 * @param req - incoming request from the client to the server
 * @param res - outgoing response from the server to the client
 * @return {Promise<*>} - sends either a status 200 or a status 400 message back to the client based on success/failure
 */
module.exports.setOptions = async (req, res) => {
    const email = req.email
    const {years, summer} = req.body
    try {
        await User.updateOne({email: email}, {years: years, openToSummer: summer})
        return res.status(200).json()
    } catch {
        return res.status(400).json({message: "Options could not be saved"})
    }
}

/**
 * This function is the first step in getting the list of classes that a user needs to take (coursesToTake).
 * This function takes care of university core and college of science requirements. If any requirements are not
 * met, the function adds courses to the coursesToTake array so that these requirements are met.
 *
 * Some requirements are not considered because they are met by other requirements. The following is a list of all
 * requirements and how they are considered in the algorithm:
 * UNIVERSITY CORE: https://www.purdue.edu/provost/students/s-initiatives/curriculum/courses.html
 * - Behavioral/Social Sciences (1 class) - stored as a t/f value in core_bss
 * - Humanities (1 class) - stored as a t/f value in core_hum
 * - Information Literacy (1 class) - stored as a t/f value in core_il
 * - Oral Communication (1 class) - stored as a t/f value in core_oc
 * - Quantitative Reasoning (1 class)- met by CS requirements
 * - Science (2 classes) - met by College of Science Lab Science requirement
 * - Science, Technology, Society (1 class) - met by College of Science Multidisplinary Experience requirement
 * - Written Communication (1 class) - stored as a t/f value in core_wc
 * COLLEGE OF SCIENCE: https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements/college-of-science-core-requirements.html
 * - First Year Composition (1 class) - identical to UNIVERSITY CORE Written communication
 * - Technical Writing & Presentation (1-2 classes) - stored as t/f values in sci_tw and sci_tp, respectively
 * - Computing - met by CS requirements
 * - Culture and Diversity (2 lang classes + 1 cult class OR 3 lang classes) - stored as sci_lang and sci_cult arrays
 * - General Education (3 classes) - stored as sci_gen array
 * - Great Issues in Science (1 class) - stored as t/f value in sci_gis
 * - Lab Science (2-3 classes) - sequences stored in sci_lab array, each sequence in the array is an object where
 *                               the properties are the sequence classes and the values are t/f
 * - Mathematics (Calc I + Calc II) - met by CS requirements
 * - Statistics (1 class) - stored as t/f value in sci_stat
 * - Team Building and Collaboration (1 class) - met by CS requirements
 * - Multidisplinary Experience - stored as a t/f value in sci_sts
 *
 * Notes about double-counting requirements:
 * First Year Composition = Written Communication
 * Lab Science automatically fulfills Science
 * Multidisciplinary Experience meets Science, Technology, Society
 * COM 217 fulfills Technical Writing, Technical Presentation, and Oral Communication
 * Some Culture classes can fulfill Behavioral/Social Science
 * General Education courses cannot double count for Culture and Diversity courses NOR Great Issues courses
 * Some General Education courses can fulfill one or more University Core requirements
 *
 * Other Notes:
 * Only STAT35000 or STAT 51100 can be used to fulfill Statistics Requirement for CS Degree
 * Only 1 class w/ prefix MGMT, ECON, OBHR, AGEC, ENTR can be used towards General Education
 *
 * Valid Lab Science Sequences (not counting CHM 12901 b/c it is not 2 classes so it does not fill UC Science):
 * BIOL 11000 + BIOL 11100
 * BIOL 12100 + BIOL 13100 + BIOL 13500
 * CHM 11500 + (CHM 11600 or CHM 12901)
 * CHM 12500 + CHM 12600
 * EAPS 11100 + EAPS 11200
 * PHYS 17200 + PHYS 27200
 * PHYS 17200 + PHYS 24100 + PHYS 25200
 * PHYS 17200 + PHYS 22100
 * PHYS 22000 + PHYS 22100
 * PHYS 23300 + PHYS 23400
 *
 *
 * @param req - incoming request from the client to the server
 * @param res - outgoing response from the server to the client
 * @param next - csAdd function that is called after this function
 */
module.exports.coreSciAdd = async (req, res, next) => {

    const email = req.email

    try {
        //finds the user
        const user = await User.findOne({email: email})
        //array to store all classes user must take in the future
        let coursesToTake = []

        //variables to track requirements
        let core_wc = false
        let core_il = false
        let core_oc = false
        let core_hum = false
        let core_bss = false
        let sci_tw = false
        let sci_tp = false
        let sci_cult = []
        let sci_lang = []
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
            "CHM 12500": false,
            "CHM 12600": false
        }
        let eaps = {
            "EAPS 11100": false,
            "EAPS 11200": false
        }
        let phys1 = {
            "PHYS 22000": false,
            "PHYS 22100": false
        }
        let phys2 = {
            "PHYS 17200": false,
            "PHYS 22100": false
        }
        let phys3 = {
            "PHYS 17200": false,
            "PHYS 27200": false
        }
        let phys4 = {
            "PHYS 17200": false,
            "PHYS 23400": false
        }
        let phys5 = {
            "PHYS 22000": false,
            "PHYS 23400": false
        }
        let phys6 = {
            "PHYS 23300": false,
            "PHYS 23400": false
        }
        let phys7 = {
            "PHYS 17200": false,
            "PHYS 24100": false,
            "PHYS 25200": false
        }
        let sci_lab = [biol1, biol2, chm1, chm2, eaps, phys1, phys2, phys3, phys4, phys5, phys6, phys7]
        let sci_stat = false
        let sci_sts = false
        let sci_gis = false
        let sci_gen = []

        const db = new sqlite3.Database("classes.db")

        //gets the classes the user has already taken
        const classesTaken = user.taken

        //iterates through already taken classes to see what requirements user has already met
        for (let i = 0; i < classesTaken.length; i++) {

            //core and college of science requirements
            await new Promise((resolve, reject) => {
                db.get(
                    "SELECT core_wc, core_il, core_oc, core_sci, core_hum, core_bss, " +
                    "sci_tw, sci_tp, sci_lang, sci_lab, sci_math, sci_stat, sci_sts, sci_gis, sci_gen FROM classesList WHERE " +
                    "class_id = ?",
                    [classesTaken[i]],
                    (err, row) => {
                        if (row.core_wc === "T" && core_wc === false) {
                            core_wc = true
                        }
                        if (row.core_il === "T" && core_il === false) {
                            core_il = true
                        }
                        if (row.core_oc === "T" && core_oc === false) {
                            core_oc = true
                        }
                        if (row.core_hum === "T" && core_hum === false) {
                            core_hum = true
                        }
                        if (row.core_bss === "T" && core_bss === false) {
                            core_bss = true
                        }
                        if (row.sci_tw === "T" && sci_tw === false) {
                            sci_tw = true
                        }
                        if (row.sci_tp === "T" && sci_tp === false) {
                            sci_tp = true
                        }
                        if (row.sci_lab === "T") {
                            // if the sequence has the class, sets that class property to true
                            sci_lab.forEach(sequence => {
                                if (sequence.hasOwnProperty(classesTaken[i])) {
                                    sequence[classesTaken[i]] = true
                                }
                            })
                        }
                        if (row.sci_stat === "T" && sci_stat === false) {
                            sci_stat = true
                        }
                        if (row.sci_sts === "T" && sci_sts === false) {
                            sci_sts = true
                        }
                        if (row.sci_gis === "T" && sci_gis === false) {
                            sci_gis = true
                            resolve() //done so that gis requirement does not also count for cult/gen-ed
                        }
                        if (row.sci_lang === "F T") {
                            sci_cult.push(classesTaken[i])
                        }
                        if (row.sci_lang === "T F") {
                            sci_lang.push(classesTaken[i])
                        }
                        if (row.sci_gen === "T") {
                            sci_gen.push(classesTaken[i])
                        }
                        resolve()
                    }
                )
            })
        }

        //WRITTEN COMMUNICATION
        if (!core_wc) {
            console.log("core_wc not met")

            coursesToTake.push("SCLA 10100")
            core_wc = true
            core_il = true
        }

        //ORAL COMMUNICATION - TECHNICAL PRESENTATION - TECHNICAL WRITING
        if (!core_oc || !sci_tp || !sci_tw) {
            console.log("core_oc and/or sci_tp and/or sci_tw not met")

            coursesToTake.push("COM 21700")
            core_oc = true
            sci_tp = true
            sci_tw = true
        }

        //MULTIDISCIPLINARY EXPERIENCE (SCIENCE TECHNOLOGY SOCIETY)
        if (!sci_sts) {
            console.log("sci_sts not met")

            coursesToTake.push("EAPS 10600")
            sci_sts = true
        }

        //LAB SCIENCE
        //checks if there exists a lab science sequence where all the classes are met
        let meet_sci_lab = false
        sci_lab.forEach(sequence => {
            if (Object.values(sequence).every(value => (value === true))) {
                meet_sci_lab = true
            }
        })
        // if lab req is not met, sees if there are any sequences where only one class is needed to complete
        // otherwise adds EAPS 11100 and EAPS 11200
        const sci_alt = []
        if (!meet_sci_lab) {
            console.log("sci_lab not met")
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
                if (falseCount === 1 && !added) {
                    coursesToTake.push(addClass)
                    sci_alt.push([addClass])
                    added = true
                }
                else if (falseCount === 1){
                    sci_alt.push([addClass])
                }
            }
            if (!added) {
                coursesToTake.push("EAPS 11100")
                coursesToTake.push("EAPS 11200")

                //all 2-course sequences are listed as alternatives in this case
                sci_alt.push(["EAPS 11100", "EAPS 11200"])
                sci_alt.push(["BIOL 11000", "BIOL 11100"])
                sci_alt.push(["CHM 11500", "CHM 11600"])
                sci_alt.push(["CHM 12500", "CHM 12600"])
                sci_alt.push(["PHYS 22000", "PHYS 22100"])
                sci_alt.push(["PHYS 17200", "PHYS 22100"])
                sci_alt.push(["PHYS 17200", "PHYS 27200"])
                sci_alt.push(["PHYS 17200", "PHYS 23400"])
                sci_alt.push(["PHYS 22000", "PHYS 23400"])
                sci_alt.push(["PHYS 23300", "PHYS 23400"])
            }
        }
        await User.updateOne({email: email}, {sci_alt: sci_alt})

        //STATISTICS
        if (!sci_stat) {
            console.log("sci_stat not met")

            coursesToTake.push("STAT 35000")
            sci_stat = true
        }

        //GREAT ISSUES IN SCIENCE
        if (!sci_gis) {
            console.log("sci_gis not met")

            coursesToTake.push("EAPS 32700")
            sci_gis = true
        }

        //LANGUAGE AND CULTURE
        let language_count = {}
        const lang_alt = []
        for (let i = 0; i < sci_lang.length; i++) {
            const language = sci_lang[i].split(" ")[0]
            if (!language_count.hasOwnProperty(language)) {
                language_count[language] = 1
            } else {
                language_count[language]++
            }
        }
        const num_lang = Math.max(...Object.values(language_count))
        if (num_lang < 3 && (num_lang !== 2 || sci_cult.length < 1)) {
            console.log("sci_lang/cult not met")
            if (sci_cult.length >= 1 && num_lang === 1) {
                //adds one lang - assumes that the first language class taken has number 10100
                const prefix = sci_lang[0].split(" ")[0]
                coursesToTake.push(prefix + " 10200")

                //adding one lang alternatives if any
                for (let i = 0; i < sci_lang.length; i++) {
                    const prefix = sci_lang[i].split(" ")[0]
                    const number = sci_lang[i].split(" ")[1]
                    if (number === '10100') {
                        lang_alt.push([prefix + " 10200"])
                        console.log(prefix + ' 10200')
                    }
                }


                //removing single culture class from gen-ed list
                if (sci_gen.includes(sci_cult[0])) {
                    console.log("removing gen-ed", sci_gen[0])
                    sci_gen.splice(sci_gen.indexOf(sci_cult[0]), 1)
                }
            } else if (sci_cult.length >= 1 && num_lang === 0) {
                //adds any two lang
                coursesToTake.push("SPAN 10100")
                coursesToTake.push("SPAN 10200")
                core_hum = true

                //adding two-lang alternatives
                lang_alt.push(['SPAN 10100', 'SPAN 10200'])
                lang_alt.push(['FR 10100', 'FR 10200'])
                lang_alt.push(['ASL 10100', 'ASL 10200'])
                lang_alt.push(['GER 10100', 'GER 10200'])
                lang_alt.push(['KOR 10100', 'KOR 10200'])
                lang_alt.push(['RUSS 10100', 'RUS 10200'])
                lang_alt.push(['CHNS 10100', 'CHNS 10200'])
                lang_alt.push(['JPNS 10100', 'JPNS 10200'])
                lang_alt.push(['ITAL 10100', 'ITAL 10200'])

                //removing single culture class from gen-ed list
                for (let i = 0; i < sci_gen.length; i++) {
                    if (sci_gen.includes(sci_cult[i])) {
                        console.log("removing gen-ed", sci_gen[i])
                        sci_gen.splice(sci_gen.indexOf(sci_cult[i]), 1)
                        break
                    }
                }
            } else if (num_lang === 1 && sci_cult.length === 0) {
                //adds one lang same as one already taken and one cult - assumes first language class taken is 10100
                const prefix = sci_lang[0].split(" ")[0]
                sci_lang.push(prefix + " 10200")
                coursesToTake.push(prefix + " 10200")
                core_hum = true

                //adding one lang alternatives if any
                for (let i = 0; i < sci_lang.length; i++) {
                    const prefix = sci_lang[i].split(" ")[0]
                    const number = sci_lang[i].split(" ")[1]
                    if (number === '10100') {
                        lang_alt.push([prefix + " 10200"])
                        console.log(prefix + ' 10200')
                    }
                }

                //POL 13000 meets cult requirement and core_bss
                sci_cult.push("POL 13000")
                coursesToTake.push("POL 13000")
                core_bss = true
            } else if (sci_cult.length === 0 && num_lang === 2) {

                //POL 13000 meets cult requirement and core_bss
                sci_cult.push("POL 13000")
                coursesToTake.push("POL 13000")
                core_bss = true
            } else { //sci_cult.length === 0 && num_lang === 0
                //adds two lang one cult
                sci_lang.push("SPAN 10100")
                coursesToTake.push("SPAN 10100")
                sci_lang.push("SPAN 10200")
                coursesToTake.push("SPAN 10200")
                core_hum = true

                //adding two-lang alternatives
                lang_alt.push(['SPAN 10100', 'SPAN 10200'])
                lang_alt.push(['FR 10100', 'FR 10200'])
                lang_alt.push(['ASL 10100', 'ASL 10200'])
                lang_alt.push(['GER 10100', 'GER 10200'])
                lang_alt.push(['KOR 10100', 'KOR 10200'])
                lang_alt.push(['RUSS 10100', 'RUSS 10200'])
                lang_alt.push(['CHNS 10100', 'CHNS 10200'])
                lang_alt.push(['ITAL 10100', 'ITAL 10200'])

                //POL 13000 meets cult requirement and core_bss
                sci_cult.push("POL 13000")
                coursesToTake.push("POL 13000")
                core_bss = true
            }
        }
        //if user has 2 lang and 1 (or more) cult, removes one cult from the gen-ed list
        else if (num_lang === 2 && sci_cult.length >= 1) {
            for (let i = 0; i < sci_gen.length; i++) {
                if (sci_gen.includes(sci_cult[i])) {
                    console.log("removing gen-ed ", sci_gen[i])
                    sci_gen.splice(sci_gen.indexOf(sci_cult[i]), 1)
                    break
                }
            }
        }
        await User.updateOne({email: email}, {lang_alt: lang_alt})

        //the only requirements besides gen-ed that may not be filled at this point are: core_il and core_bss
        //PSY 12000 and PHIL 12000 also count as gen-eds

        //BEHAVIOR SOCIAL SCIENCE (also gen-ed possibly)
        if (!core_bss) {
            console.log("core_bss not met")
            coursesToTake.push("PSY 12000")
            core_bss = true

            sci_gen.push("PSY 12000")
        }

        //INFORMATION LITERACY (also gen-ed possibly)
        if (!core_il) {
            console.log("core_il not met")
            coursesToTake.push("PHIL 12000")
            core_il = true

            sci_gen.push("PHIL 12000")
        }



        //GENERAL EDUCATION
        const easy_gen = ["PSY 12000", "PHIL 11000", "HIST 10300"]
        let usedPrefix = false
        for (let i = 0; i < sci_gen.length; i++) {
            const prefix = sci_gen[i].split(" ")[0]
            if (prefix === "AGEC" || prefix === "MGMT" || prefix === "OBHR" || prefix === "ECON" || prefix === "ENTR") {
                usedPrefix = true
                continue
            }
            if (usedPrefix && (prefix === "AGEC" || prefix === "MGMT" || prefix === "OBHR" ||
                prefix === "ECON" || prefix === "ENTR")) {
                console.log("removing gen-ed ", sci_gen[i])
                sci_gen.splice(i, 1)
            }
        }

        if (sci_gen.length < 3) {
            console.log("sci_gen not met")
            let numNeeded = 3 - sci_gen.length
            let index = 0
            while (numNeeded !== 0) {
                if (!sci_gen.includes(easy_gen[index])) {
                    sci_gen.push(easy_gen[index])
                    coursesToTake.push(easy_gen[index])
                    numNeeded--
                }
                index++
            }
        }

        req.schedule = coursesToTake
        next()

    } catch {
        return res.status(400).json({message: "Error while adding UCC and CoS requirements"})
    }
}

/**
 * This function continues adding to the coursesToTake array from the coreSciAdd function by adding classes
 * to fulfill CS Core and the user's selected CS tracks.
 *
 * @param req - incoming request from the client to the server
 * @param res - outgoing response from the server to the client
 * @param next - next function that is called: buildEmptySchedule()
 */
module.exports.csAdd = async (req, res, next) => {

    const email = req.email
    try {
        //finds the user
        const user = await User.findOne({email: email})

        //gets the classes the user has already taken
        const classesTaken = user.taken

        //tracks user selected
        const tracks = user.tracks

        let coursesToTake = req.schedule

        //adding cs math requirements
        if (!classesTaken.includes("MA 16100") && !classesTaken.includes("MA 16500")) {
            coursesToTake.push("MA 16100")
        }
        if (!classesTaken.includes("MA 16200") && !classesTaken.includes("MA 16600")) {
            coursesToTake.push("MA 16200")
        }
        if (!classesTaken.includes("MA 26100") && !classesTaken.includes("MA 27101")) {
            coursesToTake.push("MA 26100")
        }
        if (!classesTaken.includes("MA26500") && !classesTaken.includes("MA 35100")) {
            coursesToTake.push("MA 26500")
        }

        //adding cs degree core requirements
        if (!classesTaken.includes("CS 18000")) {
            coursesToTake.push("CS 18000")
        }
        if (!classesTaken.includes("CS 24000")) {
            coursesToTake.push("CS 24000")
        }
        if (!classesTaken.includes("CS 18200")) {
            coursesToTake.push("CS 18200")
        }
        if (!classesTaken.includes("CS 25000")) {
            coursesToTake.push("CS 25000")
        }
        if (!classesTaken.includes("CS 25100")) {
            coursesToTake.push("CS 25100")
        }
        if (!classesTaken.includes("CS 25200")) {
            coursesToTake.push("CS 25200")
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
                    trackElect.splice(j, 1)
                    trackObjects[i].choose = trackObjects[i].choose - 1
                    j--
                }
            }
        }

        //iterates through the OR conditions in the required array
        //removes any unnecessary OR conditions:
        //user has already taken one of the classes or one is already in the list of classes to take
        updateTracks(trackObjects, classesTaken, coursesToTake)

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
                updateTracks(trackObjects, classesTaken, coursesToTake)
                j--
            }
        }

        //pick electives
        //NEED TO CONSIDER PREREQS BECAUSE PREREQS MAY ADD 1 ADDITIONAL CLASS

        //even if a class has a prereq, we should consider it to not have any prereqs if the prereqs are already met

        let prereqs = {
            "CS 40700": "CS 30700",
            "CS 42200": "CS 35400",
            "CS 42600": "CS 35400",
            "CS 45600": "CS 35200",
            "CS 35300": "CS 35200",
            "CS 48300": "CS 38100",
            "CS 43400": "CS 33400",
        }
        updatePreReqs(prereqs, coursesToTake, classesTaken)

        let hitList = getHitList(trackObjects)

        //iterates until there are not "hits" left, meaning no more electives needed
        while (Object.keys(hitList).length !== 0) {

            console.log(hitList)

            //getting the elective with the highest hit count
            let highestHits = 0
            let choose = ""
            for (const elective in hitList) {
                if (hitList[elective] > highestHits) {
                    highestHits = hitList[elective]
                    choose = elective
                } else if (hitList[elective] === highestHits) {
                    //check if the current choose or the "challenger" has a prereq
                    //if only one of them does not have a prereq, choose that one
                    if (prereqs.hasOwnProperty(choose) && !prereqs.hasOwnProperty(elective)) {
                        highestHits = hitList[elective]
                        choose = elective
                    }
                }
            }
            //this means that the class w/ the highest # of hits has a prereq
            if (prereqs.hasOwnProperty(choose)) {
                console.log("oops what do we do now :(")
                return
            }

            //adding the chosen course to list of courses to take, updating "hit" list for next iteration
            coursesToTake.push(choose)
            console.log("choose ", choose)
            updateTracks(trackObjects, classesTaken, coursesToTake)
            hitList = getHitList(trackObjects)
            updatePreReqs(prereqs, coursesToTake, classesTaken)
        }

        await User.updateOne({email: email}, {coursesToTake: coursesToTake})
        next()
    } catch {
        return res.status(400).json({message: "user could not be found"})
    }
}

/**
 * This function will build the initial template schedule for the user. The semesters available will depend
 * on the user's options and whether the user is open to taking summer classes. If it is impossible to fit
 * the CS core classes and math classes into this initial template schedule, an error is sent back to the client.
 * Otherwise, the schedule is pre-populated with the CS core and math classes.
 *
 * @param req - request sent from the client to the server
 * @param res - response sent from the server to the client
 */

module.exports.buildEmptySchedule = async (req, res) => {

    //finds the user
    const email = req.email
    try {
        const user = await User.findOne({email: email})

        let schedule = []
        let years = user.years
        let openToSummer = user.openToSummer

        //creates empty semester arrays
        for (let i = 0; i < years; i += 0.5) {
            schedule.push([])
            if (openToSummer && (i % 0.5 === 0) && !(i % 1 === 0) && (i !== 0)) {
                schedule.push([])
            }
        }

        //updates the user's schedule on mongoDB
        await User.updateOne({email: email}, {schedule: schedule})

        return res.status(200).json()
    } catch {
        return res.status(400).json({message: "user could not be found"})
    }

}