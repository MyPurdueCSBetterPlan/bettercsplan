import alert from "sweetalert2";

const {REACT_APP_SERVER_URL} = process.env;

/**
 * Performs Google authentication for sign-up or login.
 *

 * @param {Function} navigate - Function to navigate to a different page
 * @param {Boolean} isLogin - Authentication mode ('signup' or 'login')
 * @returns {void}
 */

export default function GoogleAuth({navigate, isLogin}) {
    const width = 500;
    const height = 600;
    const top = Math.max((window.screen.availHeight - height) / 2, 0).toString()
    const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
    let loginUrl = "login";
    if (!isLogin) {
        loginUrl = "signup"
    }
    const googleWindow = window.open(
        `${REACT_APP_SERVER_URL}/google/${loginUrl}`,
        'Google Auth',
        `width=${width}, height=${height}, left=${left}, top=${top}`
    );

    // Check if the Google login window is closed at regular intervals
    const checkWindowClosed = setInterval(() => {
        if (googleWindow.closed) {
            clearInterval(checkWindowClosed);
        }
    }, 500)

    // Wait for the 'message' event from the window (server)
    window.addEventListener("message", async function (event) {
        if (event.origin !== `${REACT_APP_SERVER_URL}`) return;
        if (event.data.type === "AUTH_SUCCESS") {
            navigate("/");
            if (loginUrl === "login") {
                // Show a success message using alert (login)
                await alert.fire({
                    title: `Hello ${event.data.payload.user.name}!`,
                    text: "You logged in correctly!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                // Show a success message using alert (sign up)
                await alert.fire({
                    title: `Hello ${event.data.payload.user.name}!`,
                    text: "You signed up correctly!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } else if (event.data.type === "AUTH_ERROR") {
            navigate("/login");
            await alert.fire({
                title: "Something went wrong...",
                icon: "error",
                timer: 10000,
            });
        } else if (event.data.type === "AUTH_ERROR_USER_EXIST") {
            navigate("/login");
            // Display a custom message instead of using ErrorAction
            await alert.fire({
                title: "This user already exists.",
                icon: "error",
                timer: 10000,
            });
        }
    });
}
