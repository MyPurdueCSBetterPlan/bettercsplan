import React, {useEffect, useState} from "react";
import LogOut from "../../Components/LogOut";
import ChooseClasses from "../../Components/Auth/ChooseClasses";
import ChooseTracks from "../../Components/Auth/ChooseTracks";
import ChooseOptions from "../../Components/Auth/ChooseOptions";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {Step, StepLabel, Stepper} from "@mui/material";
import Header from "../../Components/Header/Header";

function Create() {

    const [tracksInput, setTracksInput] = useState(false);
    const [classInput, setClassInput] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const steps = ["Choose Tracks", "List Classes Taken", "Choose Options"]

    const stepperStyle = {
        padding: 2,
        "& .Mui-active": {
            "&.MuiStepIcon-root": {
                color: "warning.main",
                fontSize: "2rem",
            },
            "&.MuiStepLabel-alternativeLabel": {
              fontSize: '2vw',
              color: "warning.main"
            },
            "& .MuiStepConnector-line": {
                borderColor: "#2f234f"
            }
        },
        "& .Mui-completed": {
            "&.MuiStepIcon-root": {
                color: "#2f234f",
                fontSize: "2rem",
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: "#2f234f"
            },
            "& .MuiStepConnector-line": {
                borderColor: "#2f234f"
            }
        },
        "& .Mui-disabled": {
            ".MuiStepIcon-root": {
                color: "#2f234f",
                fontSize: '2rem'
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: "#2f234f"
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
                    Choose your tracks
                    <ChooseTracks next={() => setTracksInput(true)}/>
                    <LogOut/>
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
                    Choose your already taken courses
                    <ChooseClasses next={() => setClassInput(true)}/>
                    <LogOut/>
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
            </div>
        )
    }
}

export default Create