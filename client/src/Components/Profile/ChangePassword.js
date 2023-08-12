import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import alert from "sweetalert2";
import axios from "axios";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import React, {useState} from "react";
import {buttonStyle, textInputStyle} from "../../Themes/ThemeStyles";
import {ColorModeContext} from "../../Themes/ColorModeContext";

const {REACT_APP_SERVER_URL} = process.env;


/**
 * Renders a button to change the user's password. When clicked, it displays a dialog
 * with input fields for the old password, new password, and confirm password.
 *
 * @param {function} setIsFetching - A function to set the state for fetching status.
 * @param {function} setUnexpectedError - A function to set the state for unexpected error status.
 * @param {number} fetchingTimeout - The timeout duration for setting the fetching status.
 *
 * @return {JSX.Element} - The rendered change password button.
 */
function ChangePassword({setIsFetching, setUnexpectedError, fetchingTimeout}) {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    //Dialog status
    const [open, setOpen] = useState(false);

    // Declare state variables for error messages
    const [errorMessageOldPass, setErrorMessageOldPass] = useState('');

    // Declare state variables for error messages
    const [errorMessageNewPass, setErrorMessageNewPass] = useState('');

    // Declare state variable for showing/hiding password
    const [showPassword, setShowPassword] = useState(false);

    // Declare state variable for new password input
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Declare state variable for old password input
    const [oldPassword, setOldPassword] = useState('');

    // Declare state variable for password status
    const [passwordStatus, setPasswordStatus] = useState('');


    function handleSubmit(e) {
        //prevents page reload
        e.preventDefault();

        //Values from the form

        let emptyField = false;

        //Check for empty fields
        if (!oldPassword) {
            setErrorMessageOldPass("Empty field.");
            emptyField = true;
        }

        if (!newPassword || !confirmPassword) {
            setErrorMessageNewPass("Empty field.");
            emptyField = true;
        }

        if (!emptyField) {
            if (newPassword !== confirmPassword) { //Check if password matches.
                setErrorMessageNewPass("Passwords don't match.");
                return;
            } else {
                setErrorMessageNewPass('');
            }

            if (newPassword.includes(" ")) {
                setErrorMessageNewPass("Invalid password. It can't contain spaces.");
                return;
            }

            if (!/^.{4,20}$/.test(newPassword)) {
                setErrorMessageNewPass("Invalid password length. Max (4-20 Chars).");
                return;
            }
            if (newPassword === oldPassword) {
                setErrorMessageNewPass("Invalid Password. Please enter a new password.");
                return;
            }

            const loadingDelay = setTimeout(() => {
                setIsFetching(true);
            }, fetchingTimeout);

            axios.post(
                `${REACT_APP_SERVER_URL}/profile/changepass`,
                {
                    "oldPassword": oldPassword,
                    "newPassword": newPassword,
                },
                {withCredentials: true}
            )
                .then((response) => {
                    clearTimeout(loadingDelay);
                    const {message, status} = response.data;
                    if (!status) {
                        setErrorMessageOldPass(message);
                    } else {
                        setOpen(false);
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
                    setIsFetching(true);
                    setOpen(false);
                    setUnexpectedError(true);
                })
                .finally(() => setIsFetching(false));
        }
    }

    function clearFields() {
        setErrorMessageNewPass("");
        setNewPassword("");
        setConfirmPassword("");
        setOldPassword("");
        setErrorMessageOldPass("");
        setOpen(false);
        setShowPassword(false);
        setPasswordStatus("");
    }

    function handleInputOldPass(e) {
        const password = e.target.form.elements['oldpassword'].value;
        if (password === "") {
            setErrorMessageOldPass("");
        } else {
            setOldPassword(password);
            if (!oldPassword) {
                setErrorMessageOldPass("");
            }
        }
    }


    // Function to handle input change for new the password field also check the password strength.
    function handleInputNewPass(e) {
        e.preventDefault();

        const passwordValue = e.target.form.elements['newpassword'].value.trim();
        const confirmValue = e.target.form.elements['newpasswordVer'].value;

        if (passwordValue !== "" && confirmValue !== "") {
            if (passwordValue !== confirmValue) { // Set error message if passwords don't match
                setErrorMessageNewPass("Passwords don't match.");
                setPasswordStatus(''); // Clear password status
            } else {
                if (!passwordValue.includes(" ")) {
                    if (passwordValue.length >= 4 && passwordValue.length <= 20) {
                        // Calculate password power based on these options.
                        const passwordStrengthOptions = {
                            length: 0,
                            hasUpperCase: false,
                            hasLowerCase: false,
                            hasDigit: false,
                            hasSpecialChar: false,
                        };

                        passwordStrengthOptions.length = passwordValue.length >= 8;
                        passwordStrengthOptions.hasUpperCase = /[A-Z]+/.test(passwordValue);
                        passwordStrengthOptions.hasLowerCase = /[a-z]+/.test(passwordValue);
                        passwordStrengthOptions.hasDigit = /[0-9]+/.test(passwordValue);
                        passwordStrengthOptions.hasSpecialChar = /[^A-Za-z0-9]+/.test(passwordValue);

                        let powerScore = Object.values(passwordStrengthOptions)
                            .filter((value) => value);

                        let strength =
                            powerScore.length === 5
                                ? "Strong"
                                : powerScore.length >= 2
                                    ? "Medium"
                                    : "Weak";

                        setErrorMessageNewPass('');
                        setPasswordStatus("Your password is " + strength);
                        // Clear error message and set password status
                    } else {
                        setErrorMessageNewPass("Invalid password length. Max (4-20 Chars).");
                    }
                } else {
                    setErrorMessageNewPass("Invalid password. It can't contain spaces.");
                }
                setNewPassword(passwordValue);
                setConfirmPassword(confirmValue);
            }
        } else {
            if (passwordValue === "" && confirmValue === "") {
                // Clear error message and password status if both inputs are empty
                setErrorMessageNewPass(''); // Clear error message
                setPasswordStatus(''); // Clear password status
            } else {
                // Set error message if either password and confirm password does not match
                setErrorMessageNewPass("Passwords don't match.");
                setPasswordStatus(''); // Clear password status
            }
        }
    }

    // Function to determine helper text color based on password power type
    const getHelperTextColor = (type) => {
        if (type.includes("Strong")) return "#8BC926";    // If type includes "Strong", return green color.
        if (type.includes("Medium")) return "#ff8800";    // If type includes "Medium", return orange color.
        if (type.includes("Weak")) return theme.palette.error.main;       // If type includes "Weak", return red color.
        return theme.palette.error.main;  //Returnred color if the type is not match passwords.
    };

    return (
        <>
            <Button type="contained"
                    onClick={() => setOpen(true)}
                    sx={buttonStyle(theme.palette.mode)}>
                Change Password
            </Button>
            <Dialog open={open} onClose={() => clearFields()}>
                <DialogContent>
                    <Typography sx={{textAlign: 'center', marginBottom: '20px'}} variant="h1">Change
                        Password</Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="oldpassword"
                            label="Old password"
                            type={showPassword ? 'text' : 'password'}
                            id="oldpassword"
                            sx={textInputStyle(theme.palette.mode)}
                            error={Boolean(errorMessageOldPass)}
                            helperText={errorMessageOldPass}
                            onChange={handleInputOldPass}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newpassword"
                            label="New password"
                            type={showPassword ? 'text' : 'password'}
                            id="newpassword"
                            sx={textInputStyle(theme.palette.mode)}
                            error={Boolean(errorMessageNewPass)}
                            helperText={
                                <span style={{color: getHelperTextColor(passwordStatus)}}>
                                                    {errorMessageNewPass || passwordStatus}</span>
                            }
                            onChange={handleInputNewPass}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newpasswordVer"
                            label="Confirm new Password"
                            type={showPassword ? 'text' : 'password'}
                            id="newpasswordVer"
                            sx={textInputStyle(theme.palette.mode)}
                            error={Boolean(errorMessageNewPass)}
                            helperText={errorMessageNewPass}
                            onChange={handleInputNewPass}
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
                        <DialogActions sx={{justifyContent: 'center'}}>
                            <Button sx={buttonStyle(theme.palette.mode)}
                                    onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type='submit' sx={buttonStyle(theme.palette.mode)}>Submit</Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ChangePassword;
