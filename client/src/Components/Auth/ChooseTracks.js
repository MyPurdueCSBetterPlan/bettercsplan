import axios from "axios";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";
import {Button, ThemeProvider, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useState} from "react";
import "./ChooseComponent.css"
import { createTheme } from '@mui/material/styles';

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

        if (tracks.length === 0) {
            console.log("Select at least one track")
        } else {
            axios.post(
                `${REACT_APP_SERVER_URL}/tracks`,
                {
                    "tracks": tracks
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

    const [tracks, setTracks] = useState([]);

    const handleChange = (event, newTracks) => {
        setTracks(newTracks);
    };

    const toggleButtonStyle = {
        flexWrap: 'wrap',
        '& .MuiToggleButton-root': {
            fontFamily: 'Poppins, sans-serif'
        }
    }

    return (
        <form onSubmit={saveTracks} className="tracks-form">
            <ToggleButtonGroup
                value={tracks}
                color='warning'
                onChange={handleChange}
                aria-label="tracks"
                fullWidth
                orientation='vertical'
                size='small'
                sx={toggleButtonStyle}
            >
                <ToggleButton value="CSE" aria-label="CSE">CSE</ToggleButton>
                <ToggleButton value="Graphics" aria-label="Computer Graphics and Visualization">Computer Graphics and Visualization</ToggleButton>
                <ToggleButton value="DB" aria-label="Database and Information Systems">Database and Information Systems</ToggleButton>
                <ToggleButton value="Algo" aria-label="(Algorithmic) Foundations">(Algorithmic) Foundations</ToggleButton>
                <ToggleButton value="ML" aria-label="Machine Intelligence">Machine Intelligence</ToggleButton>
                <ToggleButton value="Language" aria-label="Programming Languages">Programming Languages</ToggleButton>
                <ToggleButton value="Security" aria-label="Security">Security</ToggleButton>
                <ToggleButton value="SWE" aria-label="Software Engineering">Software Engineering</ToggleButton>
                <ToggleButton value="Systems" aria-label="Systems">Systems Software</ToggleButton>
            </ToggleButtonGroup>
            <Button variant="contained" type='submit' fullWidth sx={{color: '#2f234f'}}>SUBMIT</Button>
        </form>
    )
}

export default ChooseTracks