import React, {useEffect, useState} from "react";
import LogOut from "../../Components/Profile/LogOut";
import ChooseClasses from "../../Components/Auth/ChooseClasses";
import ChooseTracks from "../../Components/Auth/ChooseTracks";
import ChooseOptions from "../../Components/Auth/ChooseOptions";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {Step, StepLabel, Stepper} from "@mui/material";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import './CreateForm.css'


/**
 * @return {JSX.Element} - Displays various screens that all deal with setting user information necessary
 * to determine what classes the user needs to take and generating their base (empty) schedule
 */
function Create() {

    //array to store user's selected tracks
    const [tracksInput, setTracksInput] = useState(false);

    //array to store user's taken classes
    const [classInput, setClassInput] = useState(false);

    //cookies for user authentication purposes
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const navigate = useNavigate();

    //steps for Material-UI stepper
    const steps = ["Choose Tracks", "List Classes Taken", "Choose Options"]
    const stepperStyle = {
        padding: 2,
        "& .Mui-active": {
            "&.MuiStepIcon-root": {
                color: "warning.main",
                fontSize: "2rem",
                fontFamily: 'Poppins, sans-serif'
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: "warning.main",
                fontFamily: 'Poppins, sans-serif'
            },
            "& .MuiStepConnector-line": {
                borderColor: "#2f234f"
            }
        },
        "& .Mui-completed": {
            "&.MuiStepIcon-root": {
                color: "#2f234f",
                fontSize: "2rem",
                fontFamily: 'Poppins, sans-serif'
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: "#2f234f",
                fontFamily: 'Poppins, sans-serif'
            },
            "& .MuiStepConnector-line": {
                borderColor: "#2f234f"
            }
        },
        "& .Mui-disabled": {
            ".MuiStepIcon-root": {
                color: "#2f234f",
                fontSize: '2rem',
                fontFamily: 'Poppins, sans-serif'
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: "#2f234f",
                fontFamily: 'Poppins, sans-serif'
            },
            "& .MuiStepConnector-line": {
                borderColor: '#2f234f'
            }
        }
    }

    //Checks if the user is logged in or not
    useEffect(() => {
        //if no token exists, go to login page
        if (cookies.token === undefined || !cookies.token) {
            navigate("/login");
        }
    }, [cookies, navigate, removeCookie]);


    //displays screen to input tracks, screen to input classes, or screen to input options based on
    //which ones the user has/has-not already done
    if (tracksInput === false) {
        return (
            <div>
                <div className="header">
                    <Header mode={"USER_CREATE_PROMPS"}/>
                </div>
                <div>
                    <Stepper activeStep={0} alternativeLabel sx={stepperStyle}>
                        {steps.map(step => <Step>
                            <StepLabel key={step}>{step}</StepLabel>
                        </Step>)}
                    </Stepper>
                    <ChooseTracks next={() => setTracksInput(true)}/>
                    <LogOut/>
                </div>
                <div className="footer">
                    <Footer/>
                </div>
            </div>
        )
    } else if (classInput === false) {
        return (
            <div>
                <div className="header">
                    <Header mode={"USER_CREATE_PROMPS"}/>
                </div>
                <div>
                    <Stepper activeStep={1} alternativeLabel sx={stepperStyle}>
                        {steps.map(step => <Step>
                            <StepLabel key={step}>
                                {step}</StepLabel>
                        </Step>)}
                    </Stepper>
                    <ChooseClasses next={() => setClassInput(true)}/>
                    <LogOut/>
                </div>
                <div className="footer">
                    <Footer/>
                </div>
            </div>

        )
    } else {
        return (
            <div>
                <div className="header">
                    <Header mode={"USER_CREATE_PROMPS"}/>
                </div>
                <div>
                    <Stepper activeStep={2} alternativeLabel sx={stepperStyle}>
                        {steps.map(step => <Step>
                            <StepLabel key={step}>{step}</StepLabel>
                        </Step>)}
                    </Stepper>
                    <ChooseOptions/>
                    <LogOut/>
                </div>
                <div className="footer">
                    <Footer/>
                </div>
            </div>
        )
    }
}

export default Create