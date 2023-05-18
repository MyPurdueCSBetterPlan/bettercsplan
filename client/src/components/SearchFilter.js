import {useEffect, useState} from "react";

function SearchFilter(props) {
    const[filter, setFilter] = useState("")
    const[unselected, setUnselected] = useState(props.options)
    const[selected, setSelected] = useState([])

    //updates the filter value
    function handleChange(e) {
        setFilter(e.target.value)
    }

    //sets unselected to given parameters when first rendered
    useEffect(() => {
        setUnselected(props.options)
    }, [props.options])

    function select(e) {
        setUnselected(unselected => unselected.filter(option => option !== e.target.textContent))
        setSelected(selected => [...selected, e.target.textContent])
    }

    function unselect(e) {
        setSelected(selected => selected.filter(option => option != e.target.textContent))
        setUnselected(unselected => [...unselected, e.target.textContent])
    }
    return(
        <>
            <p>Search Filter</p>
            <input type="text" onChange={handleChange}/>
            <div>
                <p>Unselected</p>
                {unselected.map((option, index) => <button key={index} onClick={select}>{option}</button>)}
            </div>
            <div>
                <p>Selected</p>
                {selected.map((option, index) => <button key={index} onClick={unselect}>{option}</button>)}
            </div>
        </>
    )
}

export default SearchFilter