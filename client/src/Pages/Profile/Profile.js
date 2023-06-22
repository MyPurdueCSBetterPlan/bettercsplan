import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import axios from "axios";
import DeleteAccount from "../../Components/Profile/DeleteAccount";
import ChangePassword from "../../Components/Profile/ChangePassword";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import {Box, Container, Grid, Typography} from "@mui/material";

const {REACT_APP_SERVER_URL} = process.env;


/**
 * Renders the user profile information along with buttons to change profile settings.
 *
 * The displayed information includes the user's email, name, and whether Google login is enabled.
 * The available buttons are "Delete Account" and "Change Password" (only for users without Google login).
 *
 * @return {JSX.Element} - The rendered profile user information component.
 */

function Profile() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [email, setEmail] = useState("");
    const [googleID, setGoogleID] = useState(false);



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
        <Container fixed>
            <Grid container spacing={2} direction="column">
                <Grid item xs={12} sm={6} lg={4}>
                    <Header mode={"USER_VERIFIED"}/>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            marginTop: '100px',
                            marginRight: '20px'
                        }}
                    >
                        <Typography variant="h1" sx={{
                            fontSize: '5rem',
                            '@media (max-width: 600px)': {
                                fontSize: '3rem',
                                textAlign: 'center'
                            },
                        }}
                        >
                            Profile Information
                        </Typography>
                        <Typography variant="h4" sx={{
                            marginTop: '10px',
                            '@media (max-width: 600px)': {
                                fontSize: '1.5rem',
                            },
                        }}
                        >
                            <center>
                                <span>Name:</span> <br/>{name} <br/>
                                <span>Email:</span> <br/>{email}<br/>
                                {googleID && (
                                    <span>Google Login: Enabled.</span>
                                )}
                            </center>
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
                        }}
                    >
                        {!googleID ? (
                            <Grid container spacing={2} justifyContent="center" alignItems="center">
                                <Grid item xs={12} sm={6} lg={4}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <ChangePassword/>
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
                                        <DeleteAccount/>
                                    </Box>
                                </Grid>
                            </Grid>
                        ) : (
                            <DeleteAccount/>
                        )}
                    </Box>
                </Grid>
            </Grid>
            <Box
                sx={{
                    paddingTop: '5px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '@media (max-width: 600px)': {
                        justifyContent: 'flex-start',
                    },
                }}
            >
                <Footer/>
            </Box>
        </Container>
    )
}

export default Profile;