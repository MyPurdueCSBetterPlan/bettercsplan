import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import axios from "axios";
import LogOut from "../../Components/Profile/LogOut"
import DeleteAccount from "../../Components/Profile/DeleteAccount";
import ChangePassword from "../../Components/Profile/ChangePassword";
import Header from "../../Components/Header/Header";
import './Profile.css'
import Footer from "../../Components/Footer/Footer";
import {Box, Button, Container, Grid, Paper, Typography} from "@mui/material";

const {REACT_APP_SERVER_URL} = process.env;


function Profile() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [email, setEmail] = useState("");
    const [googleID, setGoogleID] = useState(false);

    const buttonStyle = {
        border: '2px solid',
        '&:hover': {
            border: '2px solid',
        }
    }

    //Checks if the user is logged in or not
    useEffect(() => {

        //if no token exists, go to login page
        if (cookies.token === undefined || !cookies.token) {
            console.log("here");
            navigate("/login");
            return;
        }

        //sends post req to see if token is valid and if the user is new and acts accordingly
        // either displays the users infomration, goes back to login page, or takes them to create page
        axios.post(
            `${REACT_APP_SERVER_URL}/profile`,
            {},
            {withCredentials: true}
        )
            .then((response) => {
                const {status, googleID, email, name, verified} = response.data;
                if (status) {
                    //set boolean variable depending on whether the user is new or not
                    if (verified) {
                        setName(name);
                        setEmail(email);
                        setGoogleID(googleID);
                    } else {
                        console.log("new user");
                        navigate("/create");
                    }
                } else {
                    removeCookie("token", [])
                    navigate("/login")
                }
            })
            .catch(() => {
                removeCookie("token", []);
                navigate("/login");
            })
    }, [cookies, navigate, removeCookie]);

    return (
        <div>
            <Container fixed>
                <Box sx={{position: 'relative', zIndex: 1}}>
                    <div className="header">
                        <Header mode={"USER_VERIFIED"}/>
                    </div>
                </Box>
                <Container>
                    <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
                        <Grid item xs={12} sm={6} lg={4}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    marginTop: '100px'
                                }}
                            >
                                <Typography variant="h1" sx={{
                                    '@media (max-width: 600px)': {
                                        fontSize: '5rem',
                                        textAlign: 'center'
                                    },
                                }}
                                >
                                    Profile Information
                                </Typography>
                                <Typography variant="h4" sx={{
                                    '@media (max-width: 600px)': {
                                        fontSize: '1.5rem',
                                    },
                                }}
                                >
                                    <span>Name:</span> {name} <br/>
                                    <span>Email:</span> {email}
                                </Typography>
                                <Typography variant="h4" sx={{
                                    fontSize: '1.5rem',
                                    '@media (max-width: 600px)': {
                                        fontSize: '0.5rem',
                                    },
                                }}
                                >
                                    {googleID && (
                                        <span>Google Login: Enabled.</span>
                                    )}
                                </Typography>

                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '50px',
                                    '@media (max-width: 600px)': {
                                        marginLeft: '60px',
                                    },
                                }}
                            >
                                {!googleID ? (
                                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <ChangePassword/>
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={4}>
                                            <DeleteAccount/>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <DeleteAccount/>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={6} lg={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                '@media (max-width: 600px)': {
                                    marginLeft: '50px',
                                },
                            }}
                        >
                            <Footer/>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default Profile;