import {useState} from "react";
import "./ChooseClasses.css"
import axios from "axios";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";

const {REACT_APP_SERVER_URL} = process.env;

/**
 * @param props.next - The next functional component to be rendered after classes are saved (ChooseOptions)
 * @return {JSX.Element} - Menu where the user can search for classes using a filter and select them
 * as classes they have already taken
 */

function ChooseClasses(props) {
    const [classList, setClassList] = useState([])
    const [selected, setSelected] = useState([])

    //updates the filter value
    function handleChange(e) {
        axios.post(
            `${REACT_APP_SERVER_URL}/classes`,
            {
                "filter": e.target.value
            },
            {withCredentials: true}
        )
            .then(response => {
                setClassList(response.data.classes)
            })
            .catch(error => {
                const {message} = error.data
                ErrorAction(message)
            })
    }

    //selecting a class moves it from the unselected array to the selected array
    function select(e) {
        if (!selected.includes(e.target.textContent)) {
            setSelected(selected => [...selected, e.target.textContent])
        }
    }

    //unselecting a class moves it from the selected array to the unselected array
    function unselect(e) {
        setSelected(selected => selected.filter(option => option !== e.target.textContent))
    }

    //sends array of selected classes to the server and moves on to next page if successful
    function saveClasses() {
        axios.post(
            `${REACT_APP_SERVER_URL}/taken`,
            {
                classes: selected
            },
            {withCredentials: true}
        )
            .then(props.next)
            .catch((error) => {
                const {message} = error.data
                ErrorAction(message)
            })
    }


    return (
        <div className="split">
            <div className="filter">
                <p>Search Filter</p>
                <input type="text" onChange={handleChange}/>
                <div className="filtered-classes">
                    {classList.map((option, index) =>
                        <p key={index} onClick={select}>{option}</p>
                    )}
                </div>
            </div>
            <div className="selected">
                <p>Selected</p>
                {selected.map((option, index) =>
                    <p key={index} onClick={unselect}>{option}</p>)}
                <button type="submit" onClick={saveClasses}>Submit</button>
            </div>
        </div>
    )
}

export default ChooseClasses