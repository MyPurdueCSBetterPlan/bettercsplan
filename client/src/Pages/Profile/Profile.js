import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import axios from "axios";
import LogOut from "../../Components/LogOut"
import DeleteAccount from "../../Components/Profile/DeleteAccount";
import ChangePassword from "../../Components/Profile/ChangePassword";
import Header from "../../Components/Header/Header";

const {REACT_APP_SERVER_URL} = process.env;

function Profile() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [email, setEmail] = useState("");
    const [googleID, setGoogleID] = useState(false);


    //Checks if the user is logged in or not
    useEffect(() => {

        //if no token exists, go to login page
        if (cookies.token === undefined || !cookies.token) {
            console.log("here");
            navigate("/login");
            return;
        }

        //sends post req to see if token is valid and if the user is new and acts accordingly
        // either displays the users infomration, goes back to login page, or takes them to create page
        axios.post(
            `${REACT_APP_SERVER_URL}/profile`,
            {},
            {withCredentials: true}
        )
            .then((response) => {
                const {status, googleID, email, name, verified} = response.data;
                if (status) {
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
                    removeCookie("token", [])
                    navigate("/login")
                }
            })
            .catch(() => {
                removeCookie("token", []);
                navigate("/login");
            })
    }, [cookies, navigate, removeCookie]);

    return (
        <div>
            <div className="header">
                <Header mode={"USER_VERIFIED"}/>
            </div>
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
                        <ChangePassword/>
                    )}
                </div>
                <DeleteAccount/>
            </div>
        </div>
    )
}

export default Profile;