import axios from "axios";
import React from 'react'
import {ErrorAction} from "../../Redux/Actions/GlobalActions";
import {Alert, Box, Button, ToggleButton, ToggleButtonGroup, useTheme} from "@mui/material";
import {useState} from "react";
import {buttonStyle} from "../../Themes/ThemeStyles";
import {ColorModeContext} from "../../Themes/ColorModeContext";

const {REACT_APP_SERVER_URL} = process.env;

/**
 *
 * @param props.next - the next functional component to be returned after saving tracks (ChooseClasses)
 * @return {JSX.Element} - menu where user can select/save their desired tracks
 *
 */
function ChooseTracks(props) {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    //Sends array of track names to the server and moves on to next page if successful
    function saveTracks(e) {
        e.preventDefault()

        if (tracks.length === 0) {
            setEmptyFields(true);
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
    const [emptyFields, setEmptyFields] = useState(false); // Track selection fields empty

    const handleChange = (event, newTracks) => {
        setEmptyFields(false);
        setTracks(newTracks);
    };


    return (
        <form onSubmit={saveTracks} className="tracks-form">
            <Box sx={{marginTop: '60px'}}>
                <ToggleButtonGroup
                    value={tracks}
                    color='warning'
                    onChange={handleChange}
                    aria-label="tracks"
                    fullWidth
                    orientation='vertical'
                    size='small'
                >
                    <ToggleButton value="CSE" aria-label="CSE">CSE</ToggleButton>
                    <ToggleButton value="Graphics" aria-label="Computer Graphics and Visualization">Computer Graphics
                        and Visualization</ToggleButton>
                    <ToggleButton value="DB" aria-label="Database and Information Systems">Database and Information
                        Systems</ToggleButton>
                    <ToggleButton value="Algo" aria-label="(Algorithmic) Foundations">(Algorithmic)
                        Foundations</ToggleButton>
                    <ToggleButton value="ML" aria-label="Machine Intelligence">Machine Intelligence</ToggleButton>
                    <ToggleButton value="Language" aria-label="Programming Languages">Programming
                        Languages</ToggleButton>
                    <ToggleButton value="Security" aria-label="Security">Security</ToggleButton>
                    <ToggleButton value="SWE" aria-label="Software Engineering">Software Engineering</ToggleButton>
                    <ToggleButton value="Systems" aria-label="Systems">Systems Software</ToggleButton>
                </ToggleButtonGroup>
                {emptyFields && (
                    <Box sx={{marginTop: '10px'}}>
                        <Alert severity="error">Please select at least one track.</Alert>
                    </Box>
                )}
            </Box>
            <Box sx={{marginTop: '20px'}}>
                <Button variant="outlined" sx={buttonStyle(theme.palette.mode)} type='submit' fullWidth>SUBMIT</Button>
            </Box>
        </form>
    )
}

export default ChooseTracks