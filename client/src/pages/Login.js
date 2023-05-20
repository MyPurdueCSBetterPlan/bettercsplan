import React from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {GoogleLogin} from "./GoogleLogin";
import {useDispatch} from "react-redux";


function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //called when login is unsuccessful
    function handleError(message) {
        console.log(message)
    }

    //called when login is successful
    function handleSuccess(message) {
        console.log(message)
    }

    //called when user presses submit button
    function handleSubmit(e) {

        //prevents page reload
        e.preventDefault()

        //gets username and password from input fields as an object
        const credentials = Object.fromEntries(new FormData(e.target).entries())

        //sends username and password to server, goes to "/" on success and displays error message on failure
        axios.post(
            "http://localhost:8000/login",
            {
                "username": credentials.username,
                "password": credentials.password,
            },
            {withCredentials: true}
        )
            .then((response) => {
                const {message, success} = response.data
                if (success) {
                    setTimeout(() => navigate("/"), 300);
                    console.log("Gets logged");
                    handleSuccess(message);
                } else {
                    setTimeout(() => navigate("/"), 300);
                    handleError(message);
                }
            })
            .catch((error) => console.log(error))
    }

    // called when the user clicks on the Google sign-in button
    function handleGoogleLogin(e) {
        e.preventDefault()
        GoogleLogin(dispatch, navigate);
    }

    return (
        <div>
            <h2>Login Account</h2>
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
                        name="password"
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit">Submit</button>
                <button onClick={handleGoogleLogin}>Login with Google</button>
                <span>Don't have an account? <Link to={"/signup"}>Signup</Link></span>
            </form>
        </div>
    );
}

export default Login;