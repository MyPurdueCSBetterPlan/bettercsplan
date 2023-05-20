import {useState} from "react";
import LogOut from "../../Components/Auth/LogOut";
import ChooseClasses from "../../Components/Auth/ChooseClasses";
import ChooseTracks from "../../Components/Auth/ChooseTracks";
import ChooseOptions from "../../Components/Auth/ChooseOptions";

function Create() {

    const [tracksInput, setTracksInput] = useState(false)
    const [classInput, setClassInput] = useState(false)

    if (tracksInput === false) {
        return (
            <div>
                Choose your tracks
                <ChooseTracks next={() => setTracksInput(true)}/>
                <LogOut/>
            </div>
        )
    } else if (classInput === false) {
        return (
            <div>
                Choose your already taken courses
                <ChooseClasses next={() => setClassInput(true)}/>
                <LogOut/>
            </div>
        )
    } else {
        return (
            <div>
                <ChooseOptions/>
                <LogOut/>
            </div>

        )
    }
}

export default Create