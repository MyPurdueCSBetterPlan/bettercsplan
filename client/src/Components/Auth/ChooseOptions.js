import axios from "axios";
import {useNavigate} from "react-router-dom";
const {REACT_APP_SERVER_URL} = process.env;

function ChooseOptions() {
    const navigate = useNavigate();

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
            .then((response) => {
                if (response.status === 200) {
                    generateSchedule()
                } else {
                    console.log(response.status)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function generateSchedule() {
        axios.get(
            `${REACT_APP_SERVER_URL}/generate`,
            {withCredentials: true}
        )
            .then((response) => {
                if (response.status === 200) {
                    console.log("schedule successfully generated")
                    console.log(response.data)
                } else {
                    console.log("error during schedule generation")
                }
            })
            .catch((err) => console.log(err))
        navigate("/")
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