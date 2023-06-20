import {Box, Container, Typography} from "@mui/material";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

function Footer() {
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    return (
        <Container sx={{
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
                <Typography variant="caption" color="initial">
                    Made with love ❤️ by CS Purdue Students. Copyright ©{getCurrentYear()}.
                    <a href="https://github.com/MyPurdueCSBetterPlan" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon className="github-icon" icon={faGithub} size="2x"/>
                    </a>
                </Typography>
            </Box>
        </Container>

    )
}

export default Footer;