import axios from "axios";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";

const {REACT_APP_SERVER_URL} = process.env;

/**
 *
 * @param props.next - the next functional component to be returned after saving tracks (ChooseClasses)
 * @return {JSX.Element} - menu where user can select/save their desired tracks
 *
 */
function ChooseTracks(props) {

    //Sends array of track names to the server and moves on to next page if successful
    function saveTracks(e) {
        e.preventDefault()
        const tracks = Object.fromEntries(new FormData(e.target).entries())

        if (Object.keys(tracks).length === 0) {
            console.log("Select at least one track")
        } else {
            axios.post(
                `${REACT_APP_SERVER_URL}/tracks`,
                {
                    "tracks": Object.keys(tracks)
                },
                {withCredentials: true}
            )
                .then(props.next)
                .catch(error => {
                    const {message} = error.data
                    ErrorAction(message)
                })
        }
    }

    return (
        <form onSubmit={saveTracks}>
            <label htmlFor="CSE">Computational Science and Engineering</label>
            <input name="CSE" id="CSE" type="checkbox"/>
            <br/>
            <label htmlFor="Graphics">Computer Graphics and Visualization</label>
            <input name="Graphics" id="Graphics" type="checkbox"/>
            <br/>
            <label htmlFor="DB">Database and Information Systems</label>
            <input name="DB" id="DB" type="checkbox"/>
            <br/>
            <label htmlFor="Algo">(Algorithmic) Foundations</label>
            <input name="Algo" id="Algo" type="checkbox"/>
            <br/>
            <label htmlFor="ML">Machine Intelligence</label>
            <input name="ML" id="ML" type="checkbox"/>
            <br/>
            <label htmlFor="Language">Programming Language</label>
            <input name="Language" id="Language" type="checkbox"/>
            <br/>
            <label htmlFor="Security">Security</label>
            <input name="Security" id="Security" type="checkbox"/>
            <br/>
            <label htmlFor="SWE">Software Engineering</label>
            <input name="SWE" id="SWE" type="checkbox"/>
            <br/>
            <label htmlFor="Systems">Systems Software</label>
            <input name="Systems" id="Systems" type="checkbox"/>
            <button type="submit">SUBMIT</button>
        </form>
    )
}

export default ChooseTracks