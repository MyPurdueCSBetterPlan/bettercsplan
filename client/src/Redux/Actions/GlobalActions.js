import alert from "sweetalert2";

// Handle the Success action (data send by the server)
const SuccessActionLogin = (message, name) => {
    try {
        alert.fire({
            title: `Hello ${name}!`,
            text: `${message}`,
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
        });
    } catch (error) {
        console.log(error)
    }
};


// Handle the Error action (data send by the server)
const ErrorAction = (message) => {
    try {
        // Show a success message using alert (a library for pop-up messages)
        alert.fire({
            title: `Oops...`,
            text: `${message}`,
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
        });
    } catch (error) {
        console.log(error)
    }
};


const InvalidPassword = (message) => {
    try {
        // Show a success message using alert (a library for pop-up messages)
        alert.fire({
            title: `Oops...`,
            html:
                'Ensure that you are following the format:<br>' +
                'test<br>' +
                'test<br><br>' +
                'Invalid password... <br>',
            icon: 'error',
            showConfirmButton: true,
        });
    } catch (error) {
        console.log(error)
    }
};


// Handle the LogOut action (data send by the server)
const LogOutAction = (removeCookie, navigate) => {
    try {
        // Show a success message using alert (a library for pop-up messages)
        alert.fire({
            title: 'Are you sure?',
            text: "The account will be sign out.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Log out!'
        }).then((result) => {
            if (result.isConfirmed) {
                removeCookie("token", []);
                navigate("/login");
                alert.fire(
                    'GoodBye!',
                    'The account has been signed out.',
                    'success'
                )
            }
        })
    } catch (error) {
        console.log(error)
    }
};


export {
    LogOutAction,
    SuccessActionLogin,
    ErrorAction,
    InvalidPassword,
};
