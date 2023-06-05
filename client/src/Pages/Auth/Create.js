import {useEffect, useState} from "react";
import LogOut from "../../Components/LogOut";
import ChooseClasses from "../../Components/Auth/ChooseClasses";
import ChooseTracks from "../../Components/Auth/ChooseTracks";
import ChooseOptions from "../../Components/Auth/ChooseOptions";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

function Create() {

    const [tracksInput, setTracksInput] = useState(false);
    const [classInput, setClassInput] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const navigate = useNavigate();

    //Checks if the user is logged in or not
    useEffect(() => {
        //if no token exists, go to login page
        if (cookies.token === undefined || !cookies.token) {
            navigate("/login");
        }
    }, [cookies, navigate, removeCookie]);

    if (tracksInput === false) {
        return (
            <div>
                Choose your tracks
                <ChooseTracks next={() => setTracksInput(true)}/>
                <LogOut/>
            </div>
        )
    } else if (classInput === false) {
        return (
            <div>
                Choose your already taken courses
                <ChooseClasses next={() => setClassInput(true)}/>
                <LogOut/>
            </div>
        )
    } else {
        return (
            <div>
                <ChooseOptions/>
                <LogOut/>
            </div>

        )
    }
}

export default Create