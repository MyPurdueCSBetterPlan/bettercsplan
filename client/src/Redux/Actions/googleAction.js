import {
    setShowOverlay,
    setUser,
} from '../Reducers/AuthReducer';
import Swal from "sweetalert2";

// Handle the Google user action (data send by the server)
const googleUserAction = (payload) => {
    return async function (dispatch) {
        try {
            dispatch(setUser(payload)); // Dispatch an action to set the user data
            // Show a success message using Swal (a library for pop-up messages)
            await Swal.fire({
                title: `Hello ${payload.user.username}!`,
                text: 'You logged  in correctly!',
                icon: 'success',
                timer: 10000,
            });
        } catch (error) {
            console.log(error)
        }
    };
};


export {
    googleUserAction,
};
