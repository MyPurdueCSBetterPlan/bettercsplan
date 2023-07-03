import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import alert from "sweetalert2";
import axios from "axios";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";
import {
    Box,
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControlLabel, TextField, Typography,
    useTheme
} from "@mui/material";
import React, {useState} from "react";
import {buttonStyle, textInputStyle} from "../../Themes/ThemeStyles";
import {ColorModeContext} from "../../Themes/ColorModeContext";

const {REACT_APP_SERVER_URL} = process.env;

function ChangePassword() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    //Dialog status
    const [open, setOpen] = useState(false)

    // Declare state variables for error messages
    const [errorMessagePass, setErrorMessagePass] = useState('');

    // Declare state variable for showing/hiding password
    const [showPassword, setShowPassword] = useState(false);

    // Declare state variable for password input
    const [password, setPassword] = useState('');

    // Declare state variable for password status
    const [passwordStatus, setPasswordStatus] = useState('');


    async function handleClick() {
        const {value: formValues} = await alert.fire({
            title: 'Change Password',
            html:
                '<input id="oldPassword" type="password" placeholder="Enter your old password" class="swal2-input">' +
                '<input id="newPassword" type="password" placeholder="Enter your new password" class="swal2-input">' +
                '<input id="confirmPassword" type="password" placeholder="Confirm your new password" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('oldPassword').value,
                    document.getElementById('newPassword').value,
                    document.getElementById('confirmPassword').value
                ]
            }
        })
        if (formValues) {
            const jsonString = JSON.stringify(formValues);
            const parsedObject = JSON.parse(jsonString);
            const oldPassword = parsedObject[Object.keys(parsedObject)[0]];
            const newPassword = parsedObject[Object.keys(parsedObject)[1]];
            const confirmPassword = parsedObject[Object.keys(parsedObject)[2]];
            if ((oldPassword !== null) && (oldPassword !== "") && (newPassword !== null) && (newPassword !== "") &&
                (confirmPassword !== null) && (confirmPassword !== "")) {
                if (newPassword !== confirmPassword) {
                    ErrorAction("Ensure that the passwords match.");
                    return;
                }
                axios.post(
                    `${REACT_APP_SERVER_URL}/profile/changepass`,
                    {
                        "oldPassword": oldPassword,
                        "newPassword": newPassword,
                    },
                    {withCredentials: true}
                )
                    .then((response) => {
                        const {message, status} = response.data;
                        if (!status) {
                            ErrorAction(message);
                        } else {
                            alert.fire({
                                title: `Password Changed!`,
                                text: `Please login again...`,
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            removeCookie("token", []);
                            navigate("/login");
                        }
                    })
                    .catch(() => {
                        removeCookie("token", []);
                        navigate("/login");
                    })
            } else {
                ErrorAction("Passwords field is required.");
            }
        }
    }

    function handleSubmit(e) {
    }


    // Function to handle input change for the password field also check the password strength.
    function handleInputPass(e) {

    }

    // Function to determine helper text color based on password power type
    const getHelperTextColor = (type) => {
        if (type.includes("Strong")) return "#8BC926";    // If type includes "Strong", return green color.
        if (type.includes("Medium")) return "#ff8800";    // If type includes "Medium", return orange color.
        if (type.includes("Weak")) return "#FF0054";       // If type includes "Weak", return red color.
        return "#f44336";  //Returnred color if the type is not match passwords.
    };

    return (
        <>
            <Button type="contained" onClick={() => setOpen(true)} sx={buttonStyle(theme.palette.mode)}>Change Password</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <DialogTitle id="alert-dialog-title">
                        <Typography sx={{textAlign: 'center'}} variant="h1">Change Password</Typography>
                    </DialogTitle>
                    <Box component="form" noValidate onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="oldPassword"
                            label="Old password"
                            type={showPassword ? 'text' : 'password'}
                            id="oldPassword"
                            sx={textInputStyle(theme.palette.mode)}
                            error={Boolean(errorMessagePass)}
                            helperText={
                                <span style={{color: getHelperTextColor(passwordStatus)}}>
                                                    {errorMessagePass || passwordStatus}</span>
                            }
                            onChange={handleInputPass}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label="New password"
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            sx={textInputStyle(theme.palette.mode)}
                            error={Boolean(errorMessagePass)}
                            helperText={
                                <span style={{color: getHelperTextColor(passwordStatus)}}>
                                                    {errorMessagePass || passwordStatus}</span>
                            }
                            onChange={handleInputPass}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPasswordVer"
                            label="Confirm new Password"
                            type={showPassword ? 'text' : 'password'}
                            id="mewPasswordVer"
                            sx={textInputStyle(theme.palette.mode)}
                            error={Boolean(errorMessagePass)}
                            helperText={errorMessagePass}
                            onChange={handleInputPass}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                    color="primary"
                                />
                            }
                            label="Show Passwords"
                        />
                    </Box>
                    <DialogActions sx={{justifyContent: 'center'}}>
                        <Button sx={buttonStyle(theme.palette.mode)} onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type='submit' sx={buttonStyle(theme.palette.mode)}>Submit</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ChangePassword
