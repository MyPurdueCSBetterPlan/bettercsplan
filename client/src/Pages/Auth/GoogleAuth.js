import {googleUserAction} from "../../Redux/Actions/googleAction";
import alert from "sweetalert2";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";

const {REACT_APP_SERVER_URL} = process.env;

//It will handle the Google interaction with the server
export function GoogleAuth(dispatch, navigate, mode) {

    const googleWindow = window.open(
        `${REACT_APP_SERVER_URL}/google/${mode}`,
        'Google Auth',
        'popup=yes'
    );

    // Check if the Google login window is closed at regular intervals
    const checkWindowClosed = setInterval(() => {
        if (googleWindow.closed) {
            clearInterval(checkWindowClosed)
        }
    }, 500)

    // Wait for the 'message' event from the window (server)
    window.addEventListener('message', async function (event) {
        if (event.origin !== `${REACT_APP_SERVER_URL}`) return;
        if (event.data.type === 'AUTH_SUCCESS') {
            dispatch(googleUserAction(event.data.payload, mode));
            navigate('/')
        } else if (event.data.type === 'AUTH_ERROR') {
            await alert.fire({
                title: event.data.payload.error,
                icon: 'error',
                timer: 10000
            })
            navigate('/login')
        } else if (event.data.type === 'AUTH_ERROR_USER_EXIST') {
            navigate('/login')
            ErrorAction("This user already exist. Use Google Login instead.");
        }
    })
}
