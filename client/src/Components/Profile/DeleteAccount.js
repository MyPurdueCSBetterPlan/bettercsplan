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


/**
 * Renders a button component to delete the user's account. When clicked, it displays a confirmation dialog
 * and if the user clicks in confirm, it will delete de account.
 *
 * @param {function} setIsFetching - A function to set the state for fetching status.
 * @param {function} setUnexpectedError - A function to set the state for unexpected error status.
 * @param {number} fetchingTimeout - The timeout duration for setting the fetching status.
 *
 * @return {JSX.Element} - The rendered delete account button.
 */

function DeleteAccount({setIsFetching, setUnexpectedError, fetchingTimeout}) {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);



    //Handles the click for the delete account button.
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
                const loadingDelay = setTimeout(() => {
                    setIsFetching(true);
                }, fetchingTimeout);


                axios.post(
                    `${REACT_APP_SERVER_URL}/profile/deleteacc`,
                    {},
                    {withCredentials: true}
                )
                    .then((response) => {
                        clearTimeout(loadingDelay)
                        const {success} = response.data;
                        if (!success) {
                            ErrorAction("Something went wrong... Try Again!");
                        } else {
                            removeCookie("token", []);
                            navigate("/login");
                        }
                    })
                    .catch(() => {
                        setIsFetching(true);
                        setUnexpectedError(true);
                    })
                    .finally(() => setIsFetching(false));
            }
        })
    }


    return (
        <Button type="contained" onClick={handleClick} sx={buttonStyle(theme.palette.mode)}>Delete Account</Button>
    )
}

export default DeleteAccount;
