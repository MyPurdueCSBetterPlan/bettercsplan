import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {LogOutAction} from "../../Redux/Actions/GlobalActions";
import {Button} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

function LogOut() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    function handleClick() {
        LogOutAction(removeCookie, navigate);
    }

    const logOutStyle = {
        fontFamily: 'Poppins, sans-serif',
        position: 'fixed',
        bottom: 20,
        left: 20,
    }

    return (
        <Button color='error' endIcon={<LogoutIcon/>} onClick={handleClick} sx={logOutStyle}>
            LOGOUT
        </Button>
    )
}

export default LogOut
