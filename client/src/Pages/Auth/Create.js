import React, {useEffect, useState} from "react";
import ChooseClasses from "../../Components/Auth/ChooseClasses";
import ChooseTracks from "../../Components/Auth/ChooseTracks";
import ChooseOptions from "../../Components/Auth/ChooseOptions";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {Button, Container, Grid, Step, StepLabel, Stepper, useTheme} from "@mui/material";
import Header from "../../Components/Header/Header";
import {buttonStyle, stepperStyle} from "../../Themes/ThemeStyles";
import {ColorModeContext} from "../../Themes/ColorModeContext";
import FetchingStatus from "../../Components/Utils/FetchingStatus";


/**
 * @return {JSX.Element} - Displays various screens that all deal with setting user information necessary
 * to determine what classes the user needs to take and generating their base (empty) schedule
 */

function Create() {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);


    //array to store user's selected tracks
    const [tracksInput, setTracksInput] = useState(false);

    //array to store user's taken classes
    const [classInput, setClassInput] = useState(false);

    //cookies for user authentication purposes
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const navigate = useNavigate();

    //steps for Material-UI stepper
    const steps = ["Choose Tracks", "List Classes Taken", "Choose Options"];

    //Loading status page
    const [isFetching, setIsFetching] = useState(false);
    const [unexpectedError, setUnexpectedError] = useState(false);

    //Checks if the user is logged in or not
    useEffect(() => {
        //if no token exists, go to login page
        if (cookies.token === undefined || !cookies.token) {
            navigate("/login");
        }
    }, [cookies, navigate, removeCookie]);

    //goes back to the previous create page
    function previousCreate() {
        if (classInput === true) {
            setClassInput(false);
        } else if (tracksInput === true) {
            setTracksInput(false);
        }
    }


    //displays screen to input tracks, screen to input classes, or screen to input options based on
    //which ones the user has/has-not already done
    if (tracksInput === false) {
        return (
            <>
                <Grid container spacing={2} direction="column">
                    <Grid item xs={12} sm={6} lg={4}>
                        <Header mode={"USER_CREATE_PROMPS"}/>
                    </Grid>
                    <Grid item xs={12} sm={6} justifyContent="center" alignItems="center">
                        <Container fixed>
                            <Stepper
                                activeStep={0}
                                sx={stepperStyle(theme.palette.mode)}
                                alternativeLabel>
                                {steps.map((step, index) => (
                                    <Step key={index}>
                                        <StepLabel>{step}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <ChooseTracks next={() => setTracksInput(true)} setIsFetching={setIsFetching}
                                          setUnexpectedError={setUnexpectedError}/>
                        </Container>
                    </Grid>
                </Grid>
                <FetchingStatus isFetching={isFetching} unexpectedError={unexpectedError}/>
            </>
        )
    } else if (classInput === false) {
        return (
            <>
                <Grid container spacing={1} direction="column">
                    <Grid item xs={12} sm={6} lg={4}>
                        <Header mode={"USER_CREATE_PROMPS"}/>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4} justifyContent="center" alignItems="center">
                        <Stepper
                            activeStep={1}
                            sx={stepperStyle(theme.palette.mode)}
                            alternativeLabel>
                            {steps.map((step, index) => (
                                <Step key={index}>
                                    <StepLabel>{step}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <ChooseClasses next={() => setClassInput(true)} setIsFetching={setIsFetching}
                                       setUnexpectedError={setUnexpectedError}/>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                        <Button
                            sx={{
                                ...buttonStyle(theme.palette.mode),
                                display: 'block',
                                margin: '0 auto',
                                '@media (max-width: 600px)': {
                                    margin: '2% auto',
                                },
                            }}
                            onClick={previousCreate}>Go Back</Button>
                    </Grid>
                </Grid>
                <FetchingStatus isFetching={isFetching} unexpectedError={unexpectedError}/>
            </>
        )
    } else {
        return (
            <>
                <Grid container spacing={2} direction="column">
                    <Grid item xs={12} sm={6} lg={4}>
                        <Header mode={"USER_CREATE_PROMPS"}/>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                        <Stepper
                            activeStep={2}
                            sx={stepperStyle(theme.palette.mode)}
                            alternativeLabel>
                            {steps.map((step, index) => (
                                <Step key={index}>
                                    <StepLabel>{step}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <ChooseOptions setIsFetching={setIsFetching}
                                       setUnexpectedError={setUnexpectedError}/>
                    </Grid>
                    <Grid item>
                        <Button sx={{display: 'block', margin: '0 auto', ...buttonStyle(theme.palette.mode)}}
                                onClick={previousCreate}>Go Back</Button>
                    </Grid>
                </Grid>
                <FetchingStatus isFetching={isFetching} unexpectedError={unexpectedError}/>
            </>
        )
    }
}

export default Create