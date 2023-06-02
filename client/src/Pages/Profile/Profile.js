import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import axios from "axios";
import LogOut from "../../Components/Auth/LogOut"
import DeleteAccount from "../../Components/Profile/DeleteAccount";

const {REACT_APP_SERVER_URL} = process.env;

function Profile() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [cookies, removeCookie] = useCookies([]);
    const [email, setEmail] = useState("");
    const [googleID, setGoogleID] = useState(false);


    //sends post req to see if token is valid and if the user is new and acts accordingly
    // either displays the users infomration, goes back to login page, or takes them to create page
    axios.post(
        `${REACT_APP_SERVER_URL}/profile`,
        {},
        {withCredentials: true}
    )
        .then((response) => {
            const {status, googleID, email, name, verified} = response.data
            console.log(status);
            if (status) {
                console.log()
                //set boolean variable depending on whether the user is new or not
                if (verified) {
                    setName(name);
                    setEmail(email);
                    setGoogleID(googleID);
                } else {
                    console.log("new user");
                    navigate("/create");
                }
            } else {
                console.log("Here?");
                removeCookie("token", [])
                navigate("/login")
            }
        })
        .catch(() => {
            navigate("/login")
        })

    return (
        <>
            <div>
                <h1>Profile Information</h1>
                <h4>
                    <span>Name:</span> {name}
                </h4>
                <h4>
                    <span>Email:</span> {email}
                </h4>
                <div>
                    {googleID && (
                        <h4>
                            <span>Google Login is enabled.</span>
                        </h4>
                    )}
                </div>

                <div>
                    {!googleID && (
                        <h1>Change password</h1>
                    )}
                </div>
                <button onClick={() => navigate("/")}>Go home</button>
                <DeleteAccount/>
                <LogOut/>
            </div>
        </>
    )
}

export default Profile;