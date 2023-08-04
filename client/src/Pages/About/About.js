import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Container, Grid, Typography} from "@mui/material";
import {useCookies} from "react-cookie";
import Header from "../../Components/Header/Header";


function About() {

    //cookies for user authentication purposes
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);


    let [verified, setVerified] = useState("USER_VERIFIED");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(true);
        }, 500);

        //if no token exists, go to login page
        if (cookies.token === undefined || !cookies.token) {
            setVerified("NOT_USER_ABOUT");
        }

    }, [cookies, removeCookie, verified]);

    return (
        <>
            <Box>
                <Grid container spacing={10} direction="column">
                    <Grid item xs={12} sm={6} lg={4}>
                        <Header mode={verified}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Container fixed>
                            <Grid container spacing={2} direction="column">
                                <Grid item xs={12} md={6}>
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
                                            textAlign: 'center',
                                            '@media (max-width: 600px)': {
                                                fontSize: '3rem',
                                            },
                                            '@media (max-width: 400px)': {
                                                fontSize: '2.5rem',
                                            },
                                        }}
                                        >
                                            Test
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Container>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default About