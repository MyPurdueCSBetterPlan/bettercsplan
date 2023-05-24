/*
 * CreateController.js
 *
 * This class will...
 *
 * @bettercsplan, 2023
 */

const User = require("../../Models/UserModel")
const sqlite3 = require('sqlite3')


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
module.exports.generate = async (req, res) => {

    //finds the user
    const email = req.email
    let user
    try {
        user = await User.findOne({email: email})
    } catch {
        return res.status(400).json()
    }

    //variables to track requirements
    let core_wc = false
    let core_il = false
    let core_oc = false
    let core_sci = false
    let core_sts = false

    //let core_mqr = false //unneccessary i think b/c calc meets this
    let core_hum = false

    let core_bss = false
    let sci_tw = false
    let sci_tp = false

    /*
    culture and language requirement can be met in one of three ways:
    1. 3 language courses
    2. 2 language courses and 1 culture course
    3. 3 culture courses
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

    let sci_lab = []
    let sci_math = []
    let sci_stat = []
    let sci_sts = []
    let sci_gis = []
    let sci_gen = []

    const db = new sqlite3.Database("classes.db")

    //gets the classes the user has already taken
    const classesTaken = user.taken

    //iterates through already taken classes to see what requirements user has already met
    for (let i = 0; i < classesTaken.length; i++) {
        console.log(classesTaken[i])
        await db.get(
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
                if (row.core_sci === "T") {
                    core_sci = true
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
                    sci_cult.append(classesTaken[i])
                }
                if (row.sci_lang === "T F") {
                    sci_lang.append(classesTaken[i])
                }
                if (row.sci_lab === "T") {
                    sci_lab.append(classesTaken[i])
                }

            }
        )
    }

}
