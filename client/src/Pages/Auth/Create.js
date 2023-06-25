import React, {useEffect, useState} from "react";
import ChooseClasses from "../../Components/Auth/ChooseClasses";
import ChooseTracks from "../../Components/Auth/ChooseTracks";
import ChooseOptions from "../../Components/Auth/ChooseOptions";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {Box, Button, Container, Grid, Step, StepLabel, Stepper, useTheme} from "@mui/material";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import {stepperStyle} from "../../Themes/ThemeStyles";
import {ColorModeContext} from "../../Themes/ColorModeContext";


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
    const steps = ["Choose Tracks", "List Classes Taken", "Choose Options"]

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
            setClassInput(false)
        }
        else if (tracksInput === true) {
            setTracksInput(false)
        }
    }


    //displays screen to input tracks, screen to input classes, or screen to input options based on
    //which ones the user has/has-not already done
    if (tracksInput === false) {
        return (
            <Container fixed>
                <Grid container spacing={2} direction="column">
                    <Grid item xs={12} sm={6} lg={4}>
                        <Header mode={"USER_CREATE_PROMPS"}/>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4} justifyContent="center" alignItems="center">
                        <Stepper
                            activeStep={0}
                            sx={stepperStyle(theme.palette.mode)}
                            alternativeLabel>
                            {steps.map(step =>
                                <Step>
                                    <StepLabel key={step}>{step}</StepLabel>
                                </Step>)}
                        </Stepper>
                        <Box sx={{
                            '@media (max-width: 600px)': {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                width: '100%',
                            },
                        }}>
                            <ChooseTracks next={() => setTracksInput(true)}/>
                        </Box>

                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Footer/>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        )
    } else if (classInput === false) {
        return (
            <Container fixed>
                <Grid container spacing={2} direction="column">
                    <Grid item xs={12} sm={6} lg={4}>
                        <Header mode={"USER_CREATE_PROMPS"}/>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4} justifyContent="center" alignItems="center">
                        <Stepper
                            activeStep={1}
                            sx={stepperStyle(theme.palette.mode)}
                            alternativeLabel>
                            {steps.map(step =>
                                <Step>
                                    <StepLabel key={step}>{step}</StepLabel>
                                </Step>)}
                        </Stepper>
                        <ChooseClasses next={() => setClassInput(true)}/>
                    </Grid>
                    <Grid item>
                        <Button onClick={previousCreate}>Back</Button>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Footer page={"POSITION_RELATIVE"}/>
                        </Box>
                    </Grid>
                </Grid>

            </Container>
        )
    } else {
        return (
            <Container fixed>
                <Grid container spacing={2} direction="column">
                    <Grid item xs={12} sm={6} lg={4}>
                        <Header mode={"USER_CREATE_PROMPS"}/>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                        <Stepper
                            activeStep={2}
                            sx={stepperStyle(theme.palette.mode)}
                            alternativeLabel>
                            {steps.map(step =>
                                <Step>
                                    <StepLabel key={step}>{step}</StepLabel>
                                </Step>)}
                        </Stepper>
                        <ChooseOptions/>
                    </Grid>
                    <Grid item>
                        <Button onClick={previousCreate}>Back</Button>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Footer/>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

export default Create