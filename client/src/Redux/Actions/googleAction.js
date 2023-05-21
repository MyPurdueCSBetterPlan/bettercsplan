import {
    setUser,
} from '../Reducers/AuthReducer';
import alert from "sweetalert2";

// Handle the Google user action (data send by the server)
const googleUserAction = (payload, mode) => {
    return async function (dispatch) {
        try {
            if (payload !== null) {
                dispatch(setUser(payload)); // Dispatch an action to set the user data
                if (mode === "login") {
                    // Show a success message using alert (a library for pop-up messages) (login)
                    await alert.fire({
                        title: `Hello ${payload.user.name}!`,
                        text: 'You logged in correctly!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    // Show a success message using alert (a library for pop-up messages) (sign up)
                    await alert.fire({
                        title: `Hello ${payload.user.name}!`,
                        text: 'You signed up correctly!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            } else {
                //Show an error message if the account does not exist.
                await alert.fire({
                    title: `Oops...`,
                    text: `This account does not exist.`,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (error) {
            console.log(error)
        }
    };
};


export {
    googleUserAction,
};
