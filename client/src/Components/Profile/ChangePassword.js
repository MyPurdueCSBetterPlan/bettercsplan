import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import alert from "sweetalert2";
import axios from "axios";
import {ErrorAction, SuccessAction} from "../../Redux/Actions/GlobalActions";

const {REACT_APP_SERVER_URL} = process.env;

function ChangePassword() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);

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
                        navigate("*");
                    })
            } else {
                ErrorAction("Passwords field is required.");
            }
        }
    }


    return (
        <button onClick={handleClick}>Change Password</button>
    )
}

export default ChangePassword
