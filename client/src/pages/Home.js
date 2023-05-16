import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

function Home() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");

    //Checks if the user is logged in or not
    useEffect(() => {

        //if no token exists, go to login page
        if (cookies.token === null) {
            navigate("/login")
            return
        }

        //sends post req to see if token is valid, welcomes the user or goes to login page based on result
        axios.post(
            "http://localhost:8000",
            {},
            { withCredentials: true }
        )
            .then((response) => {
                const {status, user} = response.data
                setUsername(user)
                if (status) {
                    console.log("success!")
                } else {
                    removeCookie("token", [])
                    navigate("/login")
                }
            })
            .catch(() => {
                console.log("could not communicate with the server")
            })
    }, [cookies, navigate, removeCookie]);

    //logs the user out
    function Logout(){
        removeCookie("token", []);
        navigate("/signup");
    }

    return (
        <>
            <div>
                <h4>
                    Welcome <span>{username}</span>
                </h4>
                <button onClick={Logout}>LOGOUT</button>
            </div>
        </>
    )
}

export default Home;