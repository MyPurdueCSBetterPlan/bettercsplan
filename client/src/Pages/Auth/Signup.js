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
import {Button, TextField} from "@mui/material";

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

    return (
        <div>
            <div className="header">
                <Header mode={"NOT_USER_SIGNUP"}/>
            </div>
            <div className="two-split">
                <div className="explanation-box">
                    <h2>What data is saved?</h2>
                    <p>{dataSaved}</p>
                </div>
                <div className="Auth-box">
                    <div>
                        <h2>Signup Account</h2>
                        <TextField id="name" label="Name" variant="outlined"
                                   margin="dense" onChange={handleNameChange}/>
                        <TextField id="email" label="Email" variant="outlined"
                                   margin="dense" onChange={handleEmailChange}/>
                        <TextField id="password" label="Password" variant="outlined"
                                   margin="dense" onChange={handlePasswordChange}/>
                        <TextField id="confirm-password" label="Confirm Password" variant="outlined"
                                   margin="dense" onChange={handleConfirmChange}/>
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
                        <p className='signup-question'>Already have an account? <Link to={"/login"}>Login</Link></p>

                    </div>
                </div>
            </div>
            <div className="footer">
                <Footer/>
            </div>
        </div>

    )
}

export default Signup;