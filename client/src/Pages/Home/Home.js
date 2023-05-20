import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import axios from "axios";
import LogOut from "../../Components/Auth/LogOut"

function Home() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [email, setEmail] = useState("");

    //Checks if the user is logged in or not
    useEffect(() => {

        //if no token exists, go to login page
        if (cookies.token === null) {
            navigate("/login")
            return
        }

        //sends post req to see if token is valid and if the user is new and acts accordingly
        // either displays the user's schedule, goes back to login page, or takes them to create page
        axios.post(
            "http://localhost:8000",
            {},
            {withCredentials: true}
        )
            .then((response) => {
                const {status, user, schedule} = response.data
                setEmail(email)
                if (status) {
                    console.log("successfully logged in!")

                    //set boolean variable depending on whether the user is new or not
                    if (schedule.length !== 0) {
                        console.log("existing user")
                    } else {
                        console.log("new user")
                        navigate("/create")
                    }
                } else {
                    removeCookie("token", [])
                    navigate("/login")
                }
            })
            .catch(() => {
                console.log("could not communicate with the server")
            })
    }, [cookies, navigate, removeCookie]);

    return (
        <>
            <div>
                <h4>
                    Welcome <span>{email}</span>
                </h4>
                <LogOut/>
            </div>
        </>
    )
}

export default Home;