import React from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();

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
                <button type="submit">Submit</button>
                <span>Already have an account? <Link to={"/login"}>Login</Link></span>
            </form>
        </div>
    )
}

export default Signup;