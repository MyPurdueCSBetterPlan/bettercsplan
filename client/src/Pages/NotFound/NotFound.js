import React from "react";
import {useNavigate} from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import {Box, Button, Typography, useTheme} from "@mui/material";
import emojiNotFoundLight from './emoji-light.png';
import emojiNotFoundDark from './emoji-dark.png';
import {ColorModeContext} from "../../Themes/ColorModeContext";


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
    console.log(theme.palette.mode);
    const buttonStyle = {
        border: '2px solid',
        '&:hover': {
            border: '2px solid',
        }
    }

    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginTop: '170px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '30px',
                    }}
                >
                    <img
                        src={emojiNotFound}
                        alt=""
                        width={210} height={210}
                    />
                </Box>
                <Typography sx={{
                    fontSize: '100px'
                }} variant="h2">404</Typography>
                <Typography variant="h4">
                    Page not Found.
                </Typography>
                <Typography variant="h6">
                    The page you’re looking for doesn’t exist.
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '30px'
                }}>
                    <Button type="contained" onClick={() => navigate("/")} sx={buttonStyle}>Go Back</Button>
                </Box>
            </Box>
            <Box
                sx={{
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
        </div>
    )
}

export default NotFound;