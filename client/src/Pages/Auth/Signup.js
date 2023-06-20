import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {GoogleAuth} from "./GoogleAuth";
import {useDispatch} from "react-redux";
import GoogleButton from "react-google-button";
import {ErrorAction, InvalidPassword, SuccessActionLogin} from "../../Redux/Actions/GlobalActions";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import './AuthForm.css'
import {Button, Paper, TextField, ThemeProvider} from "@mui/material";
import {createTheme} from "@mui/material/styles";

const {REACT_APP_SERVER_URL} = process.env;

/**
 * @return {JSX.Element} - Signup screen
 */
function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const dataSaved = "We store your email, password, the list of courses you need to take, and your " +
        "schedule. Thats it."

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")

    function handleNameChange(e) {
        e.preventDefault()
        setName(e.target.value)
    }

    function handleEmailChange(e) {
        e.preventDefault()
        setEmail(e.target.value)
    }

    function handlePasswordChange(e) {
        e.preventDefault()
        setPassword(e.target.value)
    }

    function handleConfirmChange(e) {
        e.preventDefault()
        setConfirm(e.target.value)
    }

    //called when user presses submit button
    function handleSubmit(e) {

        //prevents page reload
        e.preventDefault()

        //check for password confirmation
        if (password !== confirm) {
            ErrorAction("Ensure that the passwords match.");
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

    const theme = createTheme({
        palette: {
            primary: {
                main: '#2f234f'
            },
        },
        typography: {
            fontFamily: ['Poppins', 'sans-serif'].join(',')
        }
    })

    const fieldStyle = {
        width: '240px',
        '& .MuiFormLabel-root': {
            color: '#2f234f',
        },
        '& .MuiInputBase-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2f234f',
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="header">
                <Header mode={"NOT_USER_SIGNUP"}/>
            </div>
            <div className="two-split">
                <Paper className="explanation-box" elevation='10'>
                    <h2 className='text'>What data is saved?</h2>
                    <p className='text'>{dataSaved}</p>
                </Paper>
                <Paper className="Auth-box" elevation='10'>
                    <div>
                        <h2>Signup Account</h2>
                        <TextField id="name" label="Name" variant="outlined"
                                   margin="dense" onChange={handleNameChange} sx={fieldStyle}/>
                        <TextField id="email" label="Email" variant="outlined"
                                   margin="dense" onChange={handleEmailChange} sx={fieldStyle}/>
                        <TextField id="password" label="Password" variant="outlined"
                                   margin="dense" onChange={handlePasswordChange} sx={fieldStyle}/>
                        <TextField id="confirm-password" label="Confirm Password" variant="outlined"
                                   margin="dense" onChange={handleConfirmChange} sx={fieldStyle}/>
                        <div className='google-container'>
                            <GoogleButton
                                label='Sign up with Google'
                                type="light"
                                onClick={() => {
                                    handleGoogleLogin()
                                }}
                            />
                        </div>
                        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
                        <p className='signup-question text'>Already have an account? <Link to={"/login"}>Login</Link>
                        </p>

                    </div>
                </Paper>
            </div>
            <div className="footer">
                <Footer/>
            </div>
        </ThemeProvider>

    )
}

export default Signup;