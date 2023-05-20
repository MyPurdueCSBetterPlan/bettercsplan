import {
    setUser,
} from '../Reducers/AuthReducer';
import alert from "sweetalert2";

// Handle the Google user action (data send by the server)
const googleUserAction = (payload) => {
    return async function (dispatch) {
        try {
            dispatch(setUser(payload)); // Dispatch an action to set the user data
            // Show a success message using alert (a library for pop-up messages)
            await alert.fire({
                title: `Hello ${payload.user.name}!`,
                text: 'You logged  in correctly!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.log(error)
        }
    };
};


export {
    googleUserAction,
};
