import React from "react";


function NotFound() {
    return (
        <div>
            <div>
                <h1>404</h1>
                <h4>
                    Page not found
                </h4>
                <button type="button" onClick={() => {
                    window.location.href = "/";
                }}>
                    Return to homepage
                </button>
            </div>
        </div>
    )
}

export default NotFound;