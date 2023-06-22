import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import alert from "sweetalert2";
import axios from "axios";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";
import {Button, useTheme} from "@mui/material";
import React from "react";
import {buttonStyle} from "../../Themes/ThemeStyles";
import {ColorModeContext} from "../../Themes/ColorModeContext";

const {REACT_APP_SERVER_URL} = process.env;

function DeleteAccount() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    function handleClick() {
        alert.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(
                    `${REACT_APP_SERVER_URL}/profile/deleteacc`,
                    {},
                    {withCredentials: true}
                )
                    .then((response) => {
                        const {success} = response.data;
                        if (!success) {
                            ErrorAction("Something went wrong... Try Again!");
                        } else {
                            removeCookie("token", []);
                            navigate("/login");
                        }
                    })
                    .catch(() => {
                        removeCookie("token", []);
                        navigate("/login");
                    })
            }
        })
    }


    return (
        <Button type="contained" onClick={handleClick} sx={buttonStyle(theme.palette.mode)}>Delete Account</Button>
    )
}

export default DeleteAccount;
