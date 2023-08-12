import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import GoogleAuth from "./GoogleAuth";
import GoogleButton from "react-google-button";
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
    useTheme
} from "@mui/material";
import {buttonStyle, linkStyle, textInputStyle} from "../../Themes/ThemeStyles";
import {ColorModeContext} from "../../Themes/ColorModeContext";
import FetchingStatus from "../../Components/Utils/FetchingStatus";

const {REACT_APP_SERVER_URL} = process.env;

/**
 * @return {JSX.Element} - Sign-up page where users can create a new account.
 */
function Signup() {
    const navigate = useNavigate();
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    // Declare state variables for error messages
    const [errorMessageName, setErrorMessageName] = useState('');
    const [errorMessageEmail, setErrorMessageEmail] = useState('');
    const [errorMessagePass, setErrorMessagePass] = useState('');

    //Loading status page
    const [isFetching, setIsFetching] = useState(false);
    const [unexpectedError, setUnexpectedError] = useState(false);
    const fetchingTimeout = 3000;

    // Declare state variable for showing/hiding password
    const [showPassword, setShowPassword] = useState(false);

    // Declare state variable for password input
    const [password, setPassword] = useState('');

    // Declare state variable for password status
    const [passwordStatus, setPasswordStatus] = useState('');

    const explanation = "MyBetterCSPlan, we only store the information that is necessary for our website to " +
        "function properly. This includes your name, email address, an encrypted version of your password, the list " +
        "of courses you need to take, and your schedule. That’s all we keep!";


    // Function to handle input change for name field
    function handleInputName() {
        setErrorMessageName('');
    }

    // Function to handle input change for email field
    function handleInputEmail() {
        setErrorMessageEmail('');
    }

    // Function to handle input change for the password field also check the password strength.
    function handleInputPass(e) {
        e.preventDefault();

        const passwordValue = e.target.form.elements['password'].value;
        const confirmValue = e.target.form.elements['passwordVer'].value;

        if (passwordValue !== "" && confirmValue !== "") {
            if (passwordValue !== confirmValue) { // Set error message if passwords don't match
                setErrorMessagePass("Passwords don't match.");
                setPasswordStatus(''); // Clear password status
            } else {
                if (!passwordValue.includes(" ")) {
                    if (passwordValue.length >= 4 && passwordValue.length <= 20) {
                        // Calculate password power based on these options.
                        const passwordStrengthOptions = {
                            length: 0,
                            hasUpperCase: false,
                            hasLowerCase: false,
                            hasDigit: false,
                            hasSpecialChar: false,
                        };

                        passwordStrengthOptions.length = passwordValue.length >= 8;
                        passwordStrengthOptions.hasUpperCase = /[A-Z]+/.test(passwordValue);
                        passwordStrengthOptions.hasLowerCase = /[a-z]+/.test(passwordValue);
                        passwordStrengthOptions.hasDigit = /[0-9]+/.test(passwordValue);
                        passwordStrengthOptions.hasSpecialChar = /[^A-Za-z0-9]+/.test(passwordValue);

                        let powerScore = Object.values(passwordStrengthOptions)
                            .filter((value) => value);

                        let strength =
                            powerScore.length === 5
                                ? "Strong"
                                : powerScore.length >= 2
                                    ? "Medium"
                                    : "Weak";

                        setErrorMessagePass('');
                        setPasswordStatus("Your password is " + strength);
                        // Clear error message and set password status
                    } else {
                        setErrorMessagePass("Invalid password length. Max (4-20 Chars).");
                    }
                } else {
                    setErrorMessagePass("Invalid password. It can't contain spaces.");
                }
                setPassword(passwordValue);
            }
        } else {
            if (passwordValue === "" && confirmValue === "") {
                // Clear error message and password status if both inputs are empty
                setErrorMessagePass(''); // Clear error message
                setPasswordStatus(''); // Clear password status
            } else {
                // Set error message if either password and confirm password does not match
                setErrorMessagePass("Passwords don't match.");
                setPasswordStatus(''); // Clear password status
            }
        }
    }


// Function to determine helper text color based on password power type
    const getHelperTextColor = (type) => {
        if (type.includes("Strong")) return "#8BC926";    // If type includes "Strong", return green color.
        if (type.includes("Medium")) return "#ff8800";    // If type includes "Medium", return orange color.
        if (type.includes("Weak")) return theme.palette.error.main;       // If type includes "Weak", return red color.
        return theme.palette.error.main;  //Returnred color if the type is not match passwords.
    };

    //called when user presses submit button
    function handleSubmit(e) {

        //prevents page reload
        e.preventDefault()

        //Values from the form
        const email = e.target.email.value;
        const name = e.target.username.value;
        const passwordValue = e.target.password.value;
        const confirmValue = e.target.passwordVer.value;
        let emptyField = false;


        // Check for empty fields and set error messages
        if (!email) {
            setErrorMessageEmail("Empty field.");
            emptyField = true;
        }
        if (!name) {
            setErrorMessageName("Empty field.");
            emptyField = true;
        }

        if (!passwordValue || !confirmValue) {
            setErrorMessagePass("Empty field.");
            emptyField = true;
        }

        //Send information to the server if no empty fields.
        if (!emptyField) {
            if (passwordValue !== confirmValue) { //Check if password matches.
                setErrorMessagePass("Passwords don't match.");
                return;
            } else {
                setErrorMessagePass('');
            }

            if (!/^.{4,20}$/.test(passwordValue)) {
                setErrorMessagePass("Invalid password length. Max (4-20 Chars).");
                return;
            }

            if (passwordValue.includes(" ")) {
                setErrorMessagePass("Invalid password. It can't contain spaces.");
                return;
            }

            if (!/^.{2,15}$/.test(name)) {
                setErrorMessageName("Invalid name length. Max (2-15 Chars).");
                return;
            }

            const loadingDelay = setTimeout(() => {
                setIsFetching(true);
            }, fetchingTimeout);


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
                    clearTimeout(loadingDelay);
                    const {message, success, name} = response.data
                    if (success) {
                        SuccessActionLogin(message, name);
                        navigate("/")
                    } else {
                        navigate("/signup");
                        if (message === "This account already exist.") {
                            setErrorMessageEmail("This email already exist.");
                        } else if (message === "Ensure that you are writing a valid email.") {
                            setErrorMessageEmail("Invalid email.");
                        } else if (message === "Invalid name length. Max (2-15 Chars).") {
                            setErrorMessageName("Invalid name length. Max (2-15 Chars).");
                        }
                        ErrorAction(message);
                    }
                })
                .catch(() => {
                    setIsFetching(true);
                    setUnexpectedError(true);
                })
                .finally(() => setIsFetching(false));
        }
    }

    // called when the user clicks on the Google sign-in button
    function handleGoogleLogin() {
        GoogleAuth({navigate, isLogin: false});
    }

    return (
        <>
            <Box>
                <Grid container spacing={10} direction="column">
                    <Grid item xs={12} md={6} lg={4}>
                        <Header mode={"NOT_USER_SIGNUP"}/>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={{
                            margin: '0 100px',
                            '@media (max-width: 600px)': {
                                margin: '0 30px',
                            },
                        }}>
                            <Grid container spacing={3} direction="column">
                                <Grid item xs={12} md={6} lg={4}>
                                    <Paper sx={{
                                        padding: '4%',
                                        width: '100%',
                                    }} elevation={10}>
                                        <Typography variant="h1" sx={{
                                            textAlign: 'center',
                                            marginBottom: '20px',
                                        }}>WHAT WE SAVE?</Typography>
                                        <Typography variant="h7">{explanation}</Typography>
                                        <Box sx={{
                                            paddingTop: '30px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Button type="contained"
                                                    sx={buttonStyle(theme.palette.mode)}
                                                    onClick={() => navigate("/about")}>Learn more
                                            </Button>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6} lg={4}>
                                    <Paper sx={{
                                        margin: '0 auto',
                                        padding: '3%',
                                        width: '100%',
                                    }} elevation={10}>
                                        <Typography variant="h1"
                                                    sx={{textAlign: 'center', marginBottom: '20px'}}>SIGN
                                            UP</Typography>
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
                                                helperText={
                                                    <span style={{color: getHelperTextColor(passwordStatus)}}>
                                                    {errorMessagePass || passwordStatus}</span>
                                                }
                                                onChange={handleInputPass}
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="passwordVer"
                                                label="Confirm Password"
                                                type={showPassword ? 'text' : 'password'}
                                                id="passwordVer"
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
            </Box>
            <FetchingStatus isFetching={isFetching} unexpectedError={unexpectedError}/>
        </>
    )
}

export default Signup;