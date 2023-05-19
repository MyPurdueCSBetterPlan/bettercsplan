import {useEffect, useState} from "react";
import axios from "axios";

function ChooseClasses(props) {
    const[filter, setFilter] = useState("")
    const[showClassList, setShowClassList] = useState(false)
    const[unselected, setUnselected] = useState([])
    const[selected, setSelected] = useState([])

    //updates the filter value
    function handleChange(e) {
        setFilter(e.target.value)
    }

    //shows list of filtered classes if the filter is not empty
    useEffect(() => {
        if (filter !== "") {
            setShowClassList(true)
        } else {
            setShowClassList(false)
        }
    }, [filter])

    //initializes the unselected class list
    useEffect(() => {
        axios.get(
            "http://localhost:8000/classes",
            {withCredentials: true}
        )
            .then((response) => {

                if (response.status === 200) {
                    //array containing all the class names
                    const classes = response.data.classes
                    setUnselected(classes)
                } else {
                    console.log(response.status)
                }
            })
            .catch(() => console.log("connection failed?"))
        console.log("run")
    }, [])


    //selecting a class moves it from the unselected array to the selected array
    function select(e) {
        setUnselected(unselected => unselected.filter(option => option !== e.target.textContent))
        setSelected(selected => [...selected, e.target.textContent])
    }

    //unselecting a class moves it from the selected array to the unselected array
    function unselect(e) {
        setSelected(selected => selected.filter(option => option !== e.target.textContent))
        setUnselected(unselected => [...unselected, e.target.textContent])
    }

    //sends array of selected classes to the server and moves on to next page if successful
    function saveClasses() {
        axios.post(
            "http://localhost:8000/classes",
            {
                classes: selected
            },
            {withCredentials: true}
        )
            .then((response) => {
                if (response.status === 200) {
                    props.next()
                } else {
                    console.log(response.status)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    return(
        <>
            <p>Search Filter</p>
            <input type="text" onChange={handleChange}/>
            <div>
                <p>Unselected</p>
                {unselected.map((option, index) => {
                    if (option.includes(filter.toUpperCase()) && showClassList){
                        return <p key={index} onClick={select}>{option}</p>
                    }
                })}
            </div>
            <div>
                <p>Selected</p>
                {selected.map((option, index) =>
                    <p key={index} onClick={unselect}>{option}</p>)}
                <button type="submit" onClick={saveClasses}>Submit</button>
            </div>
        </>
    )
}

export default ChooseClasses