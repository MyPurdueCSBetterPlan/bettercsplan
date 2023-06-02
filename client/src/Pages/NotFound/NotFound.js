import React from "react";
import {useNavigate} from "react-router-dom";


function NotFound() {
    const navigate = useNavigate();

    return (
        <div>
            <div>
                <h1>404</h1>
                <h4>
                    Page not found
                </h4>
                <button onClick={() => navigate("/")}>Go home</button>
            </div>
        </div>
    )
}

export default NotFound;