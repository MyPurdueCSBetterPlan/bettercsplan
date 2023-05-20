import React from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {GoogleLogin} from "./GoogleLogin";
import {useDispatch} from "react-redux";

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //called when signup is unsuccessful
    function handleError(message) {
        console.log(message)
    }

    //called when signup is successful
    function handleSuccess(message) {
        console.log(message)
    }

    //called when user presses submit button
    function handleSubmit(e) {

        //prevents page reload
        e.preventDefault()

        //gets username and password from input fields as an object
        const credentials = Object.fromEntries(new FormData(e.target).entries())

        //check for password confirmation
        if (credentials.password !== credentials.confirmPassword) {
            handleError("Passwords do not match")
            return
        }

        //sends username and password to server, goes to "/" on success and displays error message on failure
        axios.post(
            "http://localhost:8000/signup",
            {
                "username": credentials.username,
                "password": credentials.password,
            },
            {withCredentials: true}
        )
            .then((response) => {
                const {message, success, user} = response.data
                if (success) {
                    handleSuccess(message)
                    setTimeout(() => navigate("/"), 1000)
                } else {
                    handleError(message)
                }
            })
            .catch((error) => console.log(error))
    }

    // called when the user clicks on the Google sign-up button
    // called when the user clicks on the Google sign-in button
    function handleGoogleLogin(e) {
        e.preventDefault()
        GoogleLogin(dispatch, navigate);
    }

    return (
        <div>
            <h2>Signup Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
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
            <button onClick={handleGoogleLogin}>Sign up with Google</button>
        </div>
    )
}

export default Signup;