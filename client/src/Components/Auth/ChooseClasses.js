import {useState} from "react";
import "./ChooseComponent.css"
import axios from "axios";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";
import {Button, ButtonGroup, TextField, ThemeProvider} from "@mui/material";
import {createTheme} from "@mui/material/styles";

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

        //returns an empty list if nothing is in the filter
        if (e.target.value === "") {
            setClassList([])
            return
        }

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

    //empties list of selected classes
    function clearClasses() {
        setSelected([])
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#2f234f'
            },
        },
        typography: {
            fontFamily: ['Poppins', 'sans-serif'].join(',')
        }
    })

    const fieldStyle = {
        '& .MuiFormLabel-root': {
            color: '#2f234f'
        },
        '& .MuiInputBase-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2f234f',
            borderWidth: 2
        }
    }

    const buttonStyle = {
        border: '2px solid',
        '&:hover': {
            border: '2px solid',
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="split">
                <div className="filter">
                    <TextField id="outlined-basic" color='primary' label="Search Filter" variant="outlined"
                               onChange={handleChange} sx={fieldStyle} />
                    <div className="filtered-classes">
                        {classList.map((option, index) =>
                            <p className='class' key={index} onClick={select}>{option}</p>
                        )}
                    </div>
                </div>
                <div className="selected">
                    <ButtonGroup fullWidth sx={{height: 56}}>
                        <Button onClick={clearClasses} sx={buttonStyle}>Clear</Button>
                        <Button type="submit" onClick={saveClasses} sx={buttonStyle}>Submit</Button>
                    </ButtonGroup>
                    <div className='selected-classes'>
                        {selected.map((option, index) =>
                            <p className='class' key={index} onClick={unselect}>{option}</p>)}
                    </div>
                </div>
            </div>
        </ThemeProvider>

    )
}

export default ChooseClasses