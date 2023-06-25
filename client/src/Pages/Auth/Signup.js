import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {GoogleAuth} from "./GoogleAuth";
import {useDispatch} from "react-redux";
import GoogleButton from "react-google-button";
import {InvalidPassword, SuccessActionLogin} from "../../Redux/Actions/GlobalActions";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import {
    Box,
    Button, Checkbox,
    Container,
    Divider,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {buttonStyle, linkStyle, textInputStyle} from "../../Themes/ThemeStyles";
import {ColorModeContext} from "../../Themes/ColorModeContext";

const {REACT_APP_SERVER_URL} = process.env;

/**
 * @return {JSX.Element} - Signup screen
 */
function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    const [errorMessageName, setErrorMessageName] = useState('');
    const [errorMessageEmail, setErrorMessageEmail] = useState('');
    const [errorMessagePass, setErrorMessagePass] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");

    const explanation = "MyBetterCSPlan, we only store the information that is necessary for our website to " +
        "function properly. This includes your name, email address, an encrypted version of your password, the list " +
        "of courses you need to take, and your schedule. That’s all we keep!"


    function handleInputName() {
        setErrorMessageName('')
    }

    function handleInputEmail() {
        setErrorMessageEmail('')
    }

    function handleInputPass(e) {
        e.preventDefault()
        const passwordValue = e.target.form.elements['password'].value;
        const confirmValue = e.target.form.elements['password-ver'].value;
        if (passwordValue !== confirmValue) {
            setErrorMessagePass("Passwords don't match.");
        } else {
            setErrorMessagePass('');
        }

        setPassword(passwordValue);
    }


    //called when user presses submit button
    function handleSubmit(e) {

        //prevents page reload
        e.preventDefault()
        const email = e.target.email.value;
        const name = e.target.name.value;

        //check for password confirmation
        if (errorMessagePass !== null) {
            return
        }

        //sends username and password to server, goes to "/" on success and displays error message on failure
        axios.post(
            `${REACT_APP_SERVER_URL}/signup`,
            {
                "email": email,
                "name": name,
                "password": password,
            },
            {withCredentials: true}
        )
            .then((response) => {
                const {message, success, name} = response.data
                if (success) {
                    SuccessActionLogin(message, name);
                    navigate("/")
                } else {
                    navigate("/signup")
                    InvalidPassword(message);
                }
            })
            .catch(() => navigate("/login"));
    }

    // called when the user clicks on the Google sign-in button
    function handleGoogleLogin() {
        GoogleAuth(dispatch, navigate, "signup");
    }

    return (
        <Box>
            <Grid container spacing={10} direction="column">
                <Grid item xs={12} sm={6} lg={4}>
                    <Container fixed>
                        <Header mode={"NOT_USER_SIGNUP"}/>
                    </Container>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Box sx={{
                        margin: '0 200px',
                        '@media (max-width: 600px)': {
                            margin: '0 30px',
                        },
                    }}>
                        <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center">
                            <Grid item xs={12} md={6} lg={4}>
                                <Paper sx={{
                                    padding: '1%',
                                    width: '100%',
                                }} elevation={10}>
                                    <Typography variant="h1" sx={{
                                        textAlign: 'center',
                                        marginBottom: '20px',
                                    }}>WHAT WE SAVE?</Typography>
                                    <Typography variant="h7">{explanation}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <Paper sx={{
                                    padding: '3%',
                                    width: '100%',
                                }} elevation={10}>
                                    <Typography variant="h1"
                                                sx={{textAlign: 'center', marginBottom: '20px'}}>SIGN UP</Typography>
                                    <Box component="form" noValidate onSubmit={handleSubmit}>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="username"
                                            label="Username"
                                            name="username"
                                            autoFocus
                                            sx={textInputStyle(theme.palette.mode)}
                                            error={Boolean(errorMessageName)}
                                            helperText={errorMessageName}
                                            onChange={handleInputName}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
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
                                            sx={textInputStyle(theme.palette.mode)}
                                            error={Boolean(errorMessagePass)}
                                            helperText={errorMessagePass}
                                            onChange={handleInputEmail}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password-ver"
                                            label="Confirm Password"
                                            type={showPassword ? 'text' : 'password'}
                                            id="password-ver"
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
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                ...buttonStyle(theme.palette.mode),
                                                marginTop: '20px',
                                                marginBottom: '10px'
                                            }}
                                            type='submit' fullWidth>SIGN UP</Button>
                                        <Box sx={{marginTop: '15px', marginBottom: '15px', textAlign: 'center'}}>
                                            <Typography variant="h7">
                                                Do you already have an account?
                                                <a href="/login" style={linkStyle(theme.palette.mode)}> Login</a>
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
                                            label='Sign up with Google'
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
                <Footer page={"POSITION_RELATIVE"}/>
            </Box>
        </Box>
    )
}

export default Signup;