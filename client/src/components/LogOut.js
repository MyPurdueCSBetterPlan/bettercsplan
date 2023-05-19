import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

function LogOut() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    function handlePress(){
        removeCookie("token", []);
        navigate("/signup");
    }

    return(
        <button onClick={handlePress}>LOGOUT</button>
    )
}

export default LogOut

