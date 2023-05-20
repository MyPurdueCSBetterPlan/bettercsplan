import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {LogOutAction} from "../../Redux/Actions/AuthActions";

function LogOut() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);

    function handleClick() {
        LogOutAction(removeCookie, navigate);
    }

    return (
        <button onClick={handleClick}>LOGOUT</button>
    )
}

export default LogOut
