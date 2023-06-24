import {Box, Container, Typography, useTheme} from "@mui/material";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import React from "react";
import {ColorModeContext} from "../../Themes/ColorModeContext";
import ThemeCSS from "../../Themes/css/ThemeCSS.css";

/**
 * Renders a footer component for the entire page with a short message and a GitHub icon that takes to the GitHub page.
 *
 * @return {JSX.Element} - The rendered footer component.
 */

const Footer = ({page}) => {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    const mode = theme.palette.mode === 'dark' ? "dark" : "light";

    //Gets actual year.
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    return (
        <Container sx={page === "POSITION_RELATIVE" ? {
            marginTop: 'calc(10% + 60px)',
            position: 'relative',
            bottom: 0,
            width: '100%',
        } : {
            marginTop: 'calc(10% + 60px)',
            position: 'fixed',
            bottom: 0,
            width: '100%',
        }} component="footer">
            <Box
                sx={{
                    flexGrow: 2,
                    justifyContent: "center",
                    display: "flex",
                    mb: 1,
                }}
            >
                <Typography sx={{
                    '@media (max-width: 600px)': {
                    fontSize: '10px',
                    textAlign: 'center'
                },
                }} variant="caption">
                    Made with love ❤️ by CS Purdue Students. Copyright ©{getCurrentYear()}.
                    <a href="https://github.com/MyPurdueCSBetterPlan" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon className={`${mode}-github-icon`} icon={faGithub} size="2x"/>
                    </a>
                </Typography>
            </Box>
        </Container>

    )
}

export default Footer;