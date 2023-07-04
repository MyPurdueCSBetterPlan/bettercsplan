import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Box, Button, Grid, TextField, ToggleButton, useTheme} from "@mui/material";
import React, {useState} from "react";
import {ColorModeContext} from "../../Themes/ColorModeContext";
import {buttonStyle, textInputStyle} from "../../Themes/ThemeStyles";

const {REACT_APP_SERVER_URL} = process.env;

/**
 * @param setIsFetching State the page loading status.
 * @param setUnexpectedError Show error in case an unexpected error with the server.
 *
 * @return {JSX.Element} - Menu where the user can choose their schedule options: years to graduate and
 * desire to take summer classes
 */

function ChooseOptions({setIsFetching, setUnexpectedError}) {
    const navigate = useNavigate();
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    //LoadingPage Status
    const fetchingTimeout= 3000;

    //user's years until graduation
    const [years, setYears] = useState(4);

    //whether the user is open to taking summer classes
    const [summer, setSummer] = useState(false)

    //sends the user's options to the server to be saved
    function saveOptions() {

        const loadingDelay = setTimeout(() => {
            setIsFetching(true);
        }, fetchingTimeout);

        axios.post(
            `${REACT_APP_SERVER_URL}/options`,
            {
                "years": years,
                "summer": summer
            },
            {withCredentials: true}
        )
            .then(response => {
                clearTimeout(loadingDelay);
                generateSchedule();
            })
            .catch(() => setUnexpectedError(true))
            .finally(() => setIsFetching(false));
    }

    const handleChange = (event) => {
        setYears(event.target.value);
    };

    //tells the server to generate the user's schedule and navigates back to the home page on succes
    function generateSchedule() {
        const loadingDelay = setTimeout(() => {
            setIsFetching(true);
        }, fetchingTimeout);

        axios.get(
            `${REACT_APP_SERVER_URL}/generate`,
            {withCredentials: true}
        )
            .then(response => {
                clearTimeout(loadingDelay);
                navigate("/");
            })
            .catch(() => setUnexpectedError(true))
            .finally(() => setIsFetching(false));
    }

    const yearsUntilGrad = [
        {
            value: '0.5',
            label: '0.5',
        },
        {
            value: '1',
            label: '1',
        },
        {
            value: '1.5',
            label: '1.5',
        },
        {
            value: '2',
            label: '2',
        },
        {
            value: '2.5',
            label: '2.5',
        },
        {
            value: '3',
            label: '3',
        },
        {
            value: '3.5',
            label: '3.5',
        },
        {
            value: '4',
            label: '4',
        },
        {
            value: '4.5',
            label: '4.5',
        },
        {
            value: '5',
            label: '5',
        },
    ];


    return (
        <Box sx={{marginTop: '150px'}}>
            <Grid container spacing={3} direction="column" justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={6} lg={4}>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': {m: 1, width: '25ch'},
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <div>
                            <TextField
                                id="grad-years"
                                select
                                label="Years until Graduation"
                                onChange={handleChange}
                                defaultValue="4"
                                SelectProps={{
                                    native: true,
                                }}
                                sx={textInputStyle(theme.palette.mode)}
                            >
                                {yearsUntilGrad.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </TextField>
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
                        <Grid item xs={12} sm={6} lg={4}>
                            <ToggleButton value='summer' selected={summer} color='warning'
                                          onChange={() => setSummer(!summer)}>
                                Open to summer classes?
                            </ToggleButton>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                            <Button
                                sx={buttonStyle(theme.palette.mode)}
                                onClick={() => saveOptions()}>GENERATE SCHEDULE</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ChooseOptions