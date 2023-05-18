import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();

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
                    handleSuccess(message)
                    navigate("/")
                } else {
                    handleError(message)
                }
            })
            .catch((error) => console.log(error))
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
                <span>Don't have an account? <Link to={"/signup"}>Signup</Link></span>
            </form>
        </div>
    );
}

export default Login;