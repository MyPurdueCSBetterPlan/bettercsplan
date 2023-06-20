import React from "react";
import {useNavigate} from "react-router-dom";
import './NotFound.css'
import Footer from "../../Components/Footer/Footer";
import {Box, Button, Container, Grid, Typography} from "@mui/material";
import emojiNotFound from './emoji.png';

function NotFound() {
    const navigate = useNavigate();

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
                    marginTop: '200px',
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
                        width={190} height={190}
                    />
                </Box>
                <Typography variant="h1">
                    404
                </Typography>
                <Typography variant="h4">
                    Page not Found.
                </Typography>
                <Typography variant="h6">
                    The page you’re looking for doesn’t exist.
                </Typography>
                <Button type="contained" onClick={() => navigate("/")} sx={buttonStyle}>Back Home</Button>


            </Box>
            <div className="footer">
                <Footer/>
            </div>
        </div>
    )
}

export default NotFound;