import React from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {GoogleAuth} from "./GoogleAuth";
import {useDispatch} from "react-redux";
import GoogleButton from "react-google-button";
import {ErrorAction, SuccessAction} from "../../Redux/Actions/AuthActions";
const {REACT_APP_SERVER_URL} = process.env;

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //called when user presses submit button
    function handleSubmit(e) {

        //prevents page reload
        e.preventDefault()

        //gets username and password from input fields as an object
        const credentials = Object.fromEntries(new FormData(e.target).entries())

        //check for password confirmation
        if (credentials.password !== credentials.confirmPassword) {
            ErrorAction("Ensure that the passwords match.");
            return
        }

        //sends username and password to server, goes to "/" on success and displays error message on failure
        axios.post(
            `${REACT_APP_SERVER_URL}/signup`,
            {
                "email": credentials.email,
                "name": credentials.name,
                "password": credentials.password,
            },
            {withCredentials: true}
        )
            .then((response) => {
                const {message, success, name} = response.data
                if (success) {
                    SuccessAction(message, name);
                    navigate("/")
                } else {
                    navigate("/signup")
                    ErrorAction(message);
                }
            })
            .catch(() => window.location.href = "*")
    }

    // called when the user clicks on the Google sign-in button
    function handleGoogleLogin() {
        GoogleAuth(dispatch, navigate, "signup");
    }

    return (
        <div>
            <h2>Signup Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nickname</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your Nickname"
                    />
                </div>
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
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                    />
                </div>
                <button type="submit">Submit</button>
                <span>Already have an account? <Link to={"/login"}>Login</Link></span>
            </form>
            <GoogleButton
                label='Sign up with Google'
                type="light"
                onClick={() => {
                    handleGoogleLogin()
                }}
            />
        </div>
    )
}

export default Signup;