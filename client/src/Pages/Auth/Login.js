import React from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {GoogleLogin} from "./GoogleLogin";
import GoogleButton from 'react-google-button'
import {useDispatch} from "react-redux";
import {ErrorAction, SuccessAction} from "../../Redux/Actions/AuthActions";


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
        axios.post(
            "http://localhost:8000/login",
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
            .catch((error) => console.log(error))
    }

    // called when the user clicks on the Google sign-in button
    function handleGoogleLogin() {
        GoogleLogin(dispatch, navigate);
    }

    return (
        <div>
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
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit">Submit</button>
                <span>Don't have an account? <Link to={"/signup"}>Signup</Link></span>
            </form>
            <GoogleButton
                label='Sign up with Google'
                type="light"
                onClick={() => {handleGoogleLogin()}}
            />
        </div>
    );
}

export default Login;