import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import LogOut from "../components/LogOut";

function Create() {
    const navigate = useNavigate();
    const [tracksInput, setTracksInput] = useState(false)
    const [takenInput, setTakenInput] = useState(false)

    const saveTracks = (e) => {
        e.preventDefault()
        const tracks = Object.fromEntries(new FormData(e.target).entries())

        if (Object.keys(tracks).length === 0) {
            console.log("Select at least one track")
        } else {
            axios.post(
                "http://localhost:8000/tracks",
                {
                    "tracks": Object.keys(tracks)
                },
                {withCredentials: true}
            )
                .then((response) => {
                    if(response.status) {
                        setTracksInput(true)
                    } else {
                        console.log("error while updating tracks")
                    }
                })
                .catch(() => console.log("connection failed?"))
        }

    }

    if (tracksInput === false) {
        return (
            <div>
                Choose your tracks
                <form onSubmit={saveTracks}>
                    <label htmlFor="CSE">Computational Science and Engineering</label>
                    <input name="CSE" id="CSE" type="checkbox" />
                    <br/>
                    <label htmlFor="Graphics">Computer Graphics and Visualization</label>
                    <input name="Graphics" id="Graphics" type="checkbox" />
                    <br/>
                    <label htmlFor="DB">Database and Information Systems</label>
                    <input name="DB" id="DB" type="checkbox" />
                    <br/>
                    <label htmlFor="Algo">(Algorithmic) Foundations</label>
                    <input name="Algo" id="Algo" type="checkbox" />
                    <br/>
                    <label htmlFor="ML">Machine Intelligence</label>
                    <input name="ML" id="ML" type="checkbox" />
                    <br/>
                    <label htmlFor="Language">Programming Language</label>
                    <input name="Language" id="Language" type="checkbox" />
                    <br/>
                    <label htmlFor="Security">Security</label>
                    <input name="Security" id="Security" type="checkbox" />
                    <br/>
                    <label htmlFor="SWE">Software Engineering</label>
                    <input name="SWE" id="SWE" type="checkbox" />
                    <br/>
                    <label htmlFor="Systems">Systems Software</label>
                    <input name="Systems" id="Systems" type="checkbox" />
                    <button type="submit">SUBMIT</button>
                </form>
                <LogOut />
            </div>
        )
    }
    else if (takenInput === false) {
        return (
            <div>
                Choose your already taken courses
                <LogOut />
            </div>
        )
    } else {
        return (
            <div>
                Choose your graduation year, max credits per semester, and whether you want to take summer courses
            </div>
        )
    }
}

export default Create