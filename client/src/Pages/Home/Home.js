import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import axios from "axios";
import LogOut from "../../Components/Auth/LogOut"
const {REACT_APP_SERVER_URL} = process.env;

function Home() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [name, setName] = useState("");
    const [coursesToTake, setCoursesToTake] = useState([])

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
            `${REACT_APP_SERVER_URL}`,
            {},
            {withCredentials: true}
        )
            .then((response) => {
                const {status, name, coursesToTake} = response.data
                setName(name)
                if (status) {
                    //set boolean variable depending on whether the user is new or not
                    if (coursesToTake.length !== 0) {
                        console.log("existing user")
                        console.log(coursesToTake)
                        setCoursesToTake(coursesToTake)
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
                removeCookie("token", []);
                navigate("*");
            })
    }, [cookies, navigate, removeCookie]);

    return (
        <>
            <div>
                <h4>
                    Welcome <span>{name}</span>
                </h4>
                <div>
                    {coursesToTake.length !== 0 ? (
                        coursesToTake.map(className =>
                    <p>{className}</p>)): <p>Empty Schedule</p>}
                </div>
                <button onClick={() => navigate("/create")}>Create new</button>
                <button onClick={() => navigate("/profile")}>Profile Settings</button>
                <LogOut/>
            </div>
        </>
    )
}

export default Home;