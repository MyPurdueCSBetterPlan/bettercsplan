import axios from "axios";
import {useNavigate} from "react-router-dom";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";

const {REACT_APP_SERVER_URL} = process.env;

/**
 * @return {JSX.Element} - Menu where the user can choose their schedule options: years to graduate and
 * desire to take summer classes
 */
function ChooseOptions() {
    const navigate = useNavigate();

    //sends the user's options to the server to be saved
    function saveOptions(e) {
        e.preventDefault()
        const options = Object.fromEntries(new FormData(e.target).entries())
        let summer = false
        if (options.summer === "on") {
            summer = true
        }
        axios.post(
            `${REACT_APP_SERVER_URL}/options`,
            {
                "years": options.years,
                "summer": summer
            },
            {withCredentials: true}
        )
            .then(generateSchedule)
            .catch(error => {
                const {message} = error.data
                ErrorAction(message)
            })
    }

    //tells the server to generate the user's schedule and navigates back to the home page on succes
    function generateSchedule() {
        axios.get(
            `${REACT_APP_SERVER_URL}/generate`,
            {withCredentials: true}
        )
            .then(() => navigate("/"))
            .catch(error => {
                const {message} = error.data
                ErrorAction(message)
            })

    }

    return (
        <form onSubmit={saveOptions}>
            <label htmlFor="years">Years until graduation</label>
            <select name="years" id="years">
                <option>0.5</option>
                <option>1</option>
                <option>1.5</option>
                <option>2</option>
                <option>2.5</option>
                <option>3</option>
                <option>3.5</option>
                <option>4</option>
                <option>4.5</option>
                <option>5</option>
            </select>
            <br/>
            <label htmlFor="summer">Are you open to taking summer classes?</label>
            <input name="summer" id="summer" type="checkbox"/>
            <button type="submit">GENERATE SCHEDULE</button>
        </form>
    )
}

export default ChooseOptions