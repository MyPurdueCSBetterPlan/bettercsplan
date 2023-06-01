import React from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {GoogleAuth} from "./GoogleAuth";
import GoogleButton from 'react-google-button'
import {useDispatch} from "react-redux";
import {ErrorAction, SuccessAction} from "../../Redux/Actions/AuthActions";
import "./Login.css"
const {REACT_APP_SERVER_URL} = process.env;



function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //called when user presses submit button
    function handleSubmit(e) {

        //prevents page reload
        e.preventDefault()

        //gets username and password from input fields as an object
        const credentials = Object.fromEntries(new FormData(e.target).entries())
        //sends email and password to server, goes to "/" on success and displays error message on failure
        console.log(REACT_APP_SERVER_URL);
        axios.post(
            `${REACT_APP_SERVER_URL}/login`,
            {
                "email": credentials.email,
                "password": credentials.password,
            },
            {withCredentials: true}
        )
            .then((response) => {
                const {message, success, name} = response.data
                if (success) {
                    navigate("/")
                    SuccessAction(message, name);
                } else {
                    navigate("/login")
                    ErrorAction(message);
                }
            })
            .catch(() => window.location.href = "*")
    }

    // called when the user clicks on the Google sign-in button
    function handleGoogleLogin() {
        GoogleAuth(dispatch, navigate, "login");
    }

    return (
        <div>
            <p className="title">BetterCSPlan</p>
            <div className="two-split">
                <div className="explanation-box">
                    <p>Explanation of our program</p>
                </div>
                <div className="login-box">
                    <h2>Login Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button type="submit">Submit</button>
                        <span>Don't have an account? <Link to={"/signup"}>Signup</Link></span>
                    </form>
                    <GoogleButton
                        label='Login with Google'
                        type="light"
                        onClick={() => {
                            handleGoogleLogin()
                        }}
                    />
                </div>
            </div>
        </div>

    );
}

export default Login;