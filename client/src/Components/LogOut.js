import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {LogOutAction} from "../Redux/Actions/GlobalActions";

function LogOut() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies(["token"]);

    function handleClick() {
        LogOutAction(removeCookie, navigate);
    }

    return (
        <button onClick={handleClick}>LOGOUT</button>
    )
}

export default LogOut
