import React from "react";
import {useNavigate} from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import {Box, Button, Container, Grid, Typography, useTheme} from "@mui/material";
import emojiNotFoundLight from './emoji-light.png';
import emojiNotFoundDark from './emoji-dark.png';
import {ColorModeContext} from "../../Themes/ColorModeContext";
import Header from "../../Components/Header/Header";
import {buttonStyle} from "../../Themes/ThemeStyles";


/**
 * Renders the 404 page along with a return button.
 *
 * This component is responsible for displaying the 404 page when a route is not found.
 * It includes a return button to allow users to navigate back to the home page or login.
 *
 * @return {JSX.Element} - The rendered 404 page component.
 */

function NotFound() {
    const navigate = useNavigate();
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    const emojiNotFound = theme.palette.mode === 'dark' ? emojiNotFoundLight : emojiNotFoundDark;

    return (
        <Container fixed>
            <Grid container spacing={2} direction="column">
                <Grid item xs={12} sm={6} lg={4}>
                    <Header mode={"NOT_FOUND"}/>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            marginTop: '50px',
                            '@media (max-width: 600px)': {
                                marginTop: '20px',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                paddingLeft: '15px',
                                marginBottom: '30px',
                            }}
                        >
                            <img
                                src={emojiNotFound}
                                alt=""
                                width={220} height={220}
                            />
                        </Box>
                        <Typography variant="h1" sx={{
                            fontSize: '5rem',
                            '@media (max-width: 600px)': {
                                fontSize: '3rem',
                                textAlign: 'center'
                            },
                        }}>
                            404
                        </Typography>
                        <Typography sx={{
                            '@media (max-width: 600px)': {
                                fontSize: '15px',
                                textAlign: 'center'
                            },
                        }} variant="h4">
                            Page not Found.
                        </Typography>
                        <Typography sx={{
                            '@media (max-width: 600px)': {
                                fontSize: '15px',
                                textAlign: 'center'
                            },
                        }} variant="h6">
                            The page you’re looking for does not exist.
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '30px'
                        }}>
                            <Button type="contained"
                                    sx={buttonStyle(theme.palette.mode)}
                                    onClick={() => navigate("/")}>Go Back
                            </Button>
                        </Box>
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

export default NotFound;