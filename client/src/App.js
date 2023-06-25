import * as React from 'react';
import {Route, Routes} from "react-router-dom"
import Login from "./Pages/Auth/Login";
import Create from "./Pages/Auth/Create";
import Signup from "./Pages/Auth/Signup";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Profile from "./Pages/Profile/Profile";
import About from "./Pages/About/About"
import {CssBaseline, GlobalStyles, ThemeProvider, useTheme} from "@mui/material";
import ThemeMode from "./Themes/ThemeMode";
import {ColorModeContext} from "./Themes/ColorModeContext";
import {alertStyles} from "./Themes/ThemeStyles";


/**
 * App component
 *
 * This component sets up the routing and theming for the application.
 * It renders different pages based on the current URL path and applies the selected theme.
 *
 * @returns {JSX.Element} The rendered app component.
 */

function App() {
    const {newTheme, colorMode} = ThemeMode();
    return (
        <div className="App">
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={newTheme}>
                    <GlobalStyles styles={alertStyles(newTheme)}/>
                    <CssBaseline/>
                    <Routes>
                        <Route path={"/"} element={<Home/>}/>
                        <Route path={"/login"} element={<Login/>}/>
                        <Route path={"/signup"} element={<Signup/>}/>
                        <Route path={"/create"} element={<Create/>}/>
                        <Route path={"/profile"} element={<Profile/>}/>
                        <Route path={"/about"} element={<About/>}/>
                        <Route path={'*'} element={<NotFound/>}/>
                    </Routes>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </div>
    );
}

export default App