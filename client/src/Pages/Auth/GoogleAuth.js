import {googleUserAction} from "../../Redux/Actions/googleAction";
import alert from "sweetalert2";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";

const {REACT_APP_SERVER_URL} = process.env;

//It will handle the Google interaction with the server
export function GoogleAuth(dispatch, navigate, mode) {

    const width = 500;
    const height = 600;
    const top = Math.max((window.screen.availHeight - height) / 2, 0).toString()
    const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
    const googleWindow = window.open(
        `${REACT_APP_SERVER_URL}/google/${mode}`,
        'Google Auth',
        `width=${width}, height=${height}, left=${left}, top=${top}`
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
            let isLogin = {value: true};
            dispatch(googleUserAction(event.data.payload, mode, isLogin));
            if (isLogin.value) {
                navigate('/')
            } else {
                navigate("/login");
            }
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
