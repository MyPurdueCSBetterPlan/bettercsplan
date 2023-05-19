import {useState} from "react";
import LogOut from "../components/LogOut";
import ChooseClasses from "../components/ChooseClasses";
import ChooseTracks from "../components/ChooseTracks";
import ChooseOptions from "../components/ChooseOptions";


function Create() {

    const [tracksInput, setTracksInput] = useState(false)
    const [classInput, setClassInput] = useState(false)

    if (tracksInput === false) {
        return (
            <div>
                Choose your tracks
                <ChooseTracks next={() => setTracksInput(true)}/>
                <LogOut />
            </div>
        )
    }
    else if (classInput === false) {
        return (
            <div>
                Choose your already taken courses
                <ChooseClasses next={() => setClassInput(true)}/>
                <LogOut />
            </div>
        )
    } else {
        return (
            <div>
                <ChooseOptions />
                <LogOut />
            </div>

        )
    }
}

export default Create