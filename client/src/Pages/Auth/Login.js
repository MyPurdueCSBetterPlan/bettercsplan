import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {GoogleAuth} from "./GoogleAuth";
import GoogleButton from 'react-google-button'
import {useDispatch} from "react-redux";
import {ErrorAction, InvalidPassword, SuccessActionLogin} from "../../Redux/Actions/GlobalActions";
import "./AuthForm.css"
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import './AuthForm.css'
import {Button, Paper, TextField, ThemeProvider} from "@mui/material";
import {createTheme} from "@mui/material/styles";

const {REACT_APP_SERVER_URL} = process.env;


/**
 * @return {JSX.Element} - Login screen
 */
function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const explanation = "This app helps YOU, a Purdue CS major, to build the most stress-free schedule. " +
        "By selecting CS courses that overlap between the tracks you want to pursue and choosing easy courses that" +
        "fulfill multiple College of Science and University Core requirements, this app gives you a list with the " +
        "least possible number of classes necessary to graduate. Still unsatisfied? Click on any courses you dislike" +
        " to see a list of alternative classes that meet the same requirements. Then, you can plan your coursework" +
        " up until graduation by assigning classes to different semesters. Worried about prerequisites and semester " +
        "availability? Our app will tell you if you have not met any prerequisites or if a class is not offered during" +
        " a certain semester. Have any complaints or suggestions? Feel free to contact us!"

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    //called when user presses submit button
    function handleSubmit(e) {

        console.log(email)
        console.log(password)

        //prevents page reload
        e.preventDefault()

        //sends email and password to server, goes to "/" on success and displays error message on failure
        console.log(REACT_APP_SERVER_URL);
        axios.post(
            `${REACT_APP_SERVER_URL}/login`,
            {
                "email": email,
                "password": password,
            },
            {withCredentials: true}
        )
            .then((response) => {
                const {message, success, name} = response.data
                if (success) {
                    navigate("/")
                    SuccessActionLogin(message, name);
                } else {
                    navigate("/login");
                    ErrorAction(message);
                }
            })
            .catch(() => navigate("/login"));
    }

    function handleEmailChange(e) {
        e.preventDefault()
        setEmail(e.target.value)
    }

    function handlePasswordChange(e) {
        e.preventDefault()
        setPassword(e.target.value)
    }

    // called when the user clicks on the Google sign-in button
    function handleGoogleLogin() {
        GoogleAuth(dispatch, navigate, "login");
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
                <Header mode={"NOT_USER_LOGIN"}/>
            </div>
            <div className="two-split">
                <Paper className="explanation-box" elevation={10}>
                    <h2 className='text'>What it Does</h2>
                    <p className='text'>{explanation}</p>
                </Paper>
                <Paper className="Auth-box" elevation={10}>
                    <h2 className='text'>Login</h2>
                    <TextField fullWidth={false} id="email" label="Email" variant="outlined"
                               margin="dense" onChange={handleEmailChange} sx={fieldStyle}/>
                    <TextField id="password" label="Password" variant="outlined"
                               margin="dense" onChange={handlePasswordChange} sx={fieldStyle}/>
                    <div className='google-container'>
                        <GoogleButton
                            label='Login with Google'
                            type="light"
                            onClick={() => {
                                handleGoogleLogin()
                            }}
                        />
                    </div>
                    <Button onClick={handleSubmit} variant='contained'>Submit</Button>
                    <p className='signup-question text'>Don't have an account? <Link to={"/signup"}>Signup</Link></p>
                </Paper>
            </div>
            <div className="footer">
                <Footer/>
            </div>
        </ThemeProvider>

    );
}

export default Login;