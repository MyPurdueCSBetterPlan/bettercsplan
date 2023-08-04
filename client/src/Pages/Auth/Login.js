import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import GoogleAuth from "./GoogleAuth";
import GoogleButton from 'react-google-button'
import {ErrorAction, SuccessActionLogin} from "../../Themes/Actions/GlobalActions";
import Header from "../../Components/Header/Header";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import {buttonStyle, linkStyle, textInputStyle} from "../../Themes/ThemeStyles";
import {ColorModeContext} from "../../Themes/ColorModeContext";
import FetchingStatus from "../../Components/Utils/FetchingStatus";

const {REACT_APP_SERVER_URL} = process.env;


/**
 * @return {JSX.Element} - Login screen
 */

function Login() {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    const navigate = useNavigate();

    //Loading status page
    const [isFetching, setIsFetching] = useState(false);
    const [unexpectedError, setUnexpectedError] = useState(false);
    const fetchingTimeout = 3000;

    // Declare state variables for error messages
    const [errorMessageEmail, setErrorMessageEmail] = useState('');
    const [errorMessagePass, setErrorMessagePass] = useState('');

    // Declare state variable for showing/hiding password
    const [showPassword, setShowPassword] = useState(false);

    const explanation = "This app helps YOU, a Purdue CS major, to build the most stress-free schedule. " +
        "By selecting CS courses that overlap between the tracks you want to pursue and choosing easy courses that" +
        "fulfill multiple College of Science and University Core requirements, this app gives you a list with the " +
        "least possible number of classes necessary to graduate. Still unsatisfied? Click on any courses you dislike" +
        " to see a list of alternative classes that meet the same requirements. Then, you can plan your coursework" +
        " up until graduation by assigning classes to different semesters. Worried about prerequisites and semester " +
        "availability? Our app will tell you if you have not met any prerequisites or if a class is not offered during" +
        " a certain semester. Have any complaints or suggestions? Feel free to contact us!";


    //called when user presses submit button
    function handleSubmit(e) {

        //prevents page reload
        e.preventDefault();

        //Values from the form
        const email = e.target.email.value;
        const password = e.target.password.value;

        // Check for empty fields and set error messages

        if (!email) {
            setErrorMessageEmail('Empty field.');
            if (!password) { // Field Empty
                setErrorMessagePass('Empty field.');
            }
            return;
        }

        if (!password) {
            setErrorMessagePass('Empty field.');
            return;
        }


        const loadingDelay = setTimeout(() => {
            setIsFetching(true);
        }, fetchingTimeout);

        //sends email and password to server, goes to "/" on success and displays error message on failure
        axios.post(
            `${REACT_APP_SERVER_URL}/login`,
            {
                "email": email,
                "password": password,
            },
            {withCredentials: true}
        )
            .then((response) => {
                clearTimeout(loadingDelay); // Clear the loading delay timer
                const {message, success, name} = response.data
                if (success) {
                    navigate("/")
                    SuccessActionLogin(message, name);
                } else {
                    setErrorMessageEmail('Incorrect Email.');
                    setErrorMessagePass('Incorrect Password.');
                    ErrorAction(message);
                }
            })
            .catch(() => {
                setIsFetching(true);
                setUnexpectedError(true);
            })
            .finally(() => setIsFetching(false));
    }


    // called when the user clicks on the Google sign-in button
    function handleGoogleLogin() {
        GoogleAuth({navigate, isLogin: true});
    }

    //Disables texthelper error field whenever the user stats typing
    function handleInputEmail() {
        setErrorMessageEmail('')
    }

    //Disables texthelper error field whenever the user stats typing
    function handleInputPass() {
        setErrorMessagePass('')
    }

    return (
        <>
            <Box>
                <Grid container spacing={10} direction="column">
                    <Grid item xs={12} sm={6} lg={4}>
                        <Header mode={"NOT_USER_LOGIN"}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '0 50px',
                            '@media (max-width: 600px)': {
                                margin: '0 30px',
                            },
                        }}>
                            <Grid container spacing={10} justifyContent="center" sx={{flexWrap: 'wrap'}}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{
                                        padding: '5%',
                                        height: '100%',
                                    }} elevation={10}>
                                        <Typography variant="h1" sx={{
                                            textAlign: 'center',
                                            marginBottom: '20px',
                                        }}>WHAT IT DOES?</Typography>
                                        <Typography variant="h7">{explanation}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{
                                        padding: '5%',
                                        height: '100%',
                                    }} elevation={10}>
                                        <Typography variant="h1"
                                                    sx={{textAlign: 'center', marginBottom: '20px'}}>LOGIN</Typography>
                                        <Box component="form" noValidate onSubmit={handleSubmit}>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="email"
                                                label="Email Address"
                                                name="email"
                                                autoComplete="email"
                                                autoFocus
                                                sx={textInputStyle(theme.palette.mode)}
                                                error={Boolean(errorMessageEmail)}
                                                helperText={errorMessageEmail}
                                                onChange={handleInputEmail}
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="password"
                                                label="Password"
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                autoComplete="current-password"
                                                sx={textInputStyle(theme.palette.mode)}
                                                error={Boolean(errorMessagePass)}
                                                helperText={errorMessagePass}
                                                onChange={handleInputPass}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={showPassword}
                                                        onChange={() => setShowPassword(!showPassword)}
                                                        color="primary"
                                                    />
                                                }
                                                label="Show Password"
                                            />
                                            <Button variant="outlined"
                                                    sx={{
                                                        ...buttonStyle(theme.palette.mode),
                                                        marginTop: '20px',
                                                        marginBottom: '10px'
                                                    }}
                                                    type='submit' fullWidth>LOGIN</Button>
                                            <Box sx={{marginTop: '15px', marginBottom: '15px', textAlign: 'center'}}>
                                                <Typography variant="h7">
                                                    Don't have an account?
                                                    <a href="/signup" style={linkStyle(theme.palette.mode)}> Sign Up</a>
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <Divider sx={{flexGrow: 1}}/>
                                            <Typography variant="h6" sx={{px: 2}}>
                                                OR
                                            </Typography>
                                            <Divider sx={{flexGrow: 1}}/>
                                        </Box>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: '20px'
                                        }}>
                                            <GoogleButton
                                                label='Login with Google'
                                                type={theme.palette.mode === 'dark' ? 'light' : 'dark'}
                                                onClick={() => {
                                                    handleGoogleLogin()
                                                }}
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <FetchingStatus isFetching={isFetching} unexpectedError={unexpectedError}/>
        </>
    );
}

export default Login;