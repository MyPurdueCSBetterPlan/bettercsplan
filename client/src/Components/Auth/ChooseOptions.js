import axios from "axios";
import {useNavigate} from "react-router-dom";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";
import {Button, FormControl, InputLabel, Select, ThemeProvider, ToggleButton} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";
import './ChooseComponent.css'
import {createTheme} from "@mui/material/styles";

const {REACT_APP_SERVER_URL} = process.env;

/**
 * @return {JSX.Element} - Menu where the user can choose their schedule options: years to graduate and
 * desire to take summer classes
 */
function ChooseOptions() {
    const navigate = useNavigate();

    //user's years until graduation
    const [years, setYears] = useState(4);

    //whether the user is open to taking summer classes
    const [summer, setSummer] = useState(false)

    //sends the user's options to the server to be saved
    function saveOptions() {
        axios.post(
            `${REACT_APP_SERVER_URL}/options`,
            {
                "years": years,
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

    const handleChange = (event) => {
        setYears(event.target.value);
    };

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

    const formStyle = {
        '& .MuiFormLabel-root': {
            color: '#2f234f',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: '2px solid #2f234f',
        },
        '& .MuiSelect-select': {
            color: '#2f234f',
        },
        '& .MuiButtonBase-root': {
            border: '1px solid #2f234f',
            color: '#2f234f'
        },

    }

    return (
        <div className='options-form'>
            <ThemeProvider theme={theme}>
                <FormControl onSubmit={saveOptions} sx={formStyle}>
                    <InputLabel id="grad-years">Years until Graduation</InputLabel>
                    <Select
                        labelId="grad-years"
                        id="grad-years"
                        value={years}
                        label="Years until Graduation"
                        onChange={handleChange}
                    >
                        <MenuItem value={0.5}>0.5</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={1.5}>1.5</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={2.5}>2.5</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={3.5}>3.5</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={4.5}>4.5</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                    </Select>
                    <ToggleButton value='summer' selected={summer} color='warning' onChange={() => setSummer(!summer)}>
                        Open to summer classes?
                    </ToggleButton>
                    <Button onClick={() => saveOptions()}>GENERATE SCHEDULE</Button>
                </FormControl>
            </ThemeProvider>
        </div>

    )
}

export default ChooseOptions