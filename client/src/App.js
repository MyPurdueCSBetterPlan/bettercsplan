import * as React from 'react';
import {useEffect, useState} from 'react';
import {Navigate, Route, Routes, useLocation} from "react-router-dom"
import Login from "./Pages/Auth/Login";
import Create from "./Pages/Auth/Create";
import Signup from "./Pages/Auth/Signup";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Profile from "./Pages/Profile/Profile";
import About from "./Pages/About/About"
import {Container, CssBaseline, GlobalStyles, ThemeProvider} from "@mui/material";
import ThemeMode from "./Themes/ThemeMode";
import {ColorModeContext} from "./Themes/ColorModeContext";
import {alertStyles} from "./Themes/ThemeStyles";
import Footer from "./Components/Footer/Footer";
import './App.css';
import {isMobile} from "react-device-detect";


/**
 * App component
 *
 * This component sets up the routing and theming for the application.
 * It renders different pages based on the current URL path and applies the selected theme.
 *
 * @returns {JSX.Element} The rendered app component.
 */

function App() {
    // Obtain the theme and color mode
    const {newTheme, colorMode} = ThemeMode();

    // Get the current location using React Router
    const location = useLocation();

    // State variables for the footer style
    const [styleFooter, setStyleFooter] = useState("footer");

    const footerBottom = location.pathname === "/profile"
        || location.pathname === "/notfound"
    const homeFooter = location.pathname === "/"
    const createFooter = location.pathname === "/create"
    const authFooter = location.pathname === "/login"
        || location.pathname === "/signup";


    useEffect(() => {
        //Set the footer style based on the current location
        if (footerBottom) {
            setStyleFooter("footer footer-bottom");
        } else if (createFooter) {
            if (isMobile) {
                setStyleFooter("footer footer-create");
            } else {
                setStyleFooter("footer footer-home");
            }
        } else if (homeFooter) {
            setStyleFooter("footer footer-home");
        } else if (authFooter) {
            setStyleFooter("footer footer-create");
        } else {
            setStyleFooter("footer");
        }
    }, [footerBottom, createFooter]);

    return (
        <div>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={newTheme}>
                    <GlobalStyles styles={alertStyles(newTheme)}/>
                    <CssBaseline/>
                    <Container maxWidth={false} disableGutters>
                        <Routes>
                            <Route path={"/"} element={<Home/>}/>
                            <Route path={"/login"} element={<Login/>}/>
                            <Route path={"/signup"} element={<Signup/>}/>
                            <Route path={"/create"} element={<Create/>}/>
                            <Route path={"/profile"} element={<Profile/>}/>
                            <Route path={"/about"} element={<About/>}/>
                            <Route path="*" element={<Navigate to="/notfound"/>}/>
                            <Route path="/notfound" element={<NotFound/>}/>
                        </Routes>
                        <div className={styleFooter}>
                            <Footer/>
                        </div>
                    </Container>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </div>
    );
}

export default App