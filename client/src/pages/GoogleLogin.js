// called when the user clicks on the Google sign-in button
import {googleUserAction} from "../Redux/Actions/googleAction";
import Swal from "sweetalert2";

export function GoogleLogin(dispatch, navigate) {

    const googleWindow = window.open('http://localhost:8000/google', 'Google Login', 'popup=yes');

    // Check if the Google login window is closed at regular intervals
    const checkWindowClosed = setInterval(() => {
        if(googleWindow.closed) {
            clearInterval(checkWindowClosed)
        }
    }, 500)

    // Wait for the 'message' event from the window (server)
    window.addEventListener('message', async function (event) {
        if(event.origin !== 'http://localhost:8000') return;
        if(event.data.type === 'AUTH_SUCCESS') {
            dispatch(googleUserAction(event.data.payload));
            navigate('/')
        } else if(event.data.type === 'AUTH_ERROR') {
            await Swal.fire({
                title: event.data.payload.error,
                icon: 'error',
                timer: 10000
            })
        }
    })
}
