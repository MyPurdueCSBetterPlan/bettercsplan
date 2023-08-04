import React from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import './Header.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faBars,
    faEnvelope,
    faHomeAlt,
    faInfoCircle,
    faMoon,
    faRotateRight,
    faSignInAlt,
    faSignOut,
    faSun,
    faUser,
    faUserEdit,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import {useCookies} from "react-cookie";
import {LogOutAction} from "../../Themes/Actions/GlobalActions";
import {Typography, useTheme} from "@mui/material";
import {ColorModeContext} from "../../Themes/ColorModeContext";


/**
 * Renders the navigation component based on the specified mode.
 *
 * @param mode - The mode indicating the desired navigation tab:
 *              - 'USER_VERIFIED' for navigation tabs for verified users.
 *              - 'USER_CREATE_PROMPTS' for navigation tabs for user creation prompts process.
 *              - 'NOT_USER_LOGIN' for navigation tabs for the login page.
 *              - 'NOT_USER_SIGNUP' for navigation tabs for the signup page.
 * @return {JSX.Element} - The rendered navigation component for users to navigate through the page.
 */

const Header = ({mode}) => {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [anchorPr, setAnchorPr] = React.useState(null);
    const [anchorMn, setAnchorMn] = React.useState(null);
    const openProfile = Boolean(anchorPr);
    const openMenu = Boolean(anchorMn);
    const navigate = useNavigate();
    const color = theme.palette.mode === 'dark' ? 'white' : 'black';

    const handleProfile = (event) => {
        setAnchorPr(event.currentTarget);
    };

    const handleCloseProfile = () => {
        setAnchorPr(null);
    };

    const handleMenu = (event) => {
        setAnchorMn(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorMn(null);
    };


    if (mode === "USER_VERIFIED") {
        return (
            <nav className="header">
                <div className="container">
                    <Typography variant="h1"> MYBETTERCSPLAN</Typography>
                    <div className="header-icons">
                        <ul>
                            <li>
                                <div onClick={colorMode.toggleColorMode} style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ? <FontAwesomeIcon icon={faSun}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>
                            <li>
                                <div onClick={handleMenu}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                                <Menu
                                    anchorEl={anchorMn}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem" onClick={() => navigate("/")}>
                                        <FontAwesomeIcon icon={faHomeAlt}/>
                                        {String.fromCharCode(160)} Home
                                    </MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => navigate("/about")}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                        {String.fromCharCode(160)} About
                                    </MenuItem>
                                    <MenuItem className="MenuItem">
                                        <a style={{cursor: 'pointer', textDecoration: 'none', color: `${color}`}}
                                           href="mailto:bettercsplan@gmail.com">
                                            <FontAwesomeIcon icon={faEnvelope}/> Contact
                                        </a>
                                    </MenuItem>
                                    <MenuItem sx={{
                                        marginTop: "30px",
                                        cursor: "default",
                                        "&:hover": {backgroundColor: "transparent"}
                                    }}>
                                        <Typography variant="h1" sx={{fontSize: '20px'}}>Account Settings</Typography>
                                    </MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => navigate("/profile")}>
                                        <FontAwesomeIcon icon={faUserEdit}/>
                                        {String.fromCharCode(160)} Edit Profile
                                    </MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => navigate("/create")}>
                                        <FontAwesomeIcon icon={faRotateRight}/>
                                        {String.fromCharCode(160)} Remake Schedule
                                    </MenuItem>
                                    <MenuItem sx={{marginTop: '20px'}}
                                              className="MenuItem"
                                              onClick={() => LogOutAction(removeCookie, navigate)}>
                                        <FontAwesomeIcon icon={faSignOut}/>
                                        {String.fromCharCode(160)} Sign Out
                                    </MenuItem>
                                </Menu>
                            </li>
                        </ul>
                    </div>
                    <div className="header-elements">
                        <ul>
                            <li>
                                <NavLink to="/">
                                    <Typography variant="h7">
                                        <FontAwesomeIcon icon={faHomeAlt}/> Home
                                    </Typography>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about">
                                    <Typography variant="h7">
                                        <FontAwesomeIcon icon={faInfoCircle}/> About
                                    </Typography>
                                </NavLink>
                            </li>
                            <li>
                                <div style={{cursor: 'pointer'}}>
                                    <a href="mailto:bettercsplan@gmail.com">
                                        <Typography variant="h7">
                                            <FontAwesomeIcon icon={faEnvelope}/> Contact
                                        </Typography>
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div onClick={handleProfile} className="account-icon" style={{cursor: 'pointer'}}>
                                    <Typography variant="h7">
                                        <FontAwesomeIcon icon={faUser}/> Account
                                    </Typography>
                                </div>
                                <Menu
                                    anchorEl={anchorPr}
                                    open={openProfile}
                                    onClose={handleCloseProfile}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem" onClick={() => navigate("/profile")}>
                                        <FontAwesomeIcon icon={faUserEdit}/>
                                        {String.fromCharCode(160)} Edit Profile
                                    </MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => navigate("/create")}>
                                        <FontAwesomeIcon icon={faRotateRight}/>
                                        {String.fromCharCode(160)} Remake Schedule
                                    </MenuItem>
                                    <MenuItem sx={{marginTop: '20px'}}
                                              className="MenuItem"
                                              onClick={() => LogOutAction(removeCookie, navigate)}>
                                        <FontAwesomeIcon icon={faSignOut}/>
                                        {String.fromCharCode(160)} Sign Out
                                    </MenuItem>
                                </Menu>
                            </li>
                            <li>
                                <div onClick={colorMode.toggleColorMode} className="thmode-icon"
                                     style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ? <FontAwesomeIcon icon={faSun}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        )
    } else if (mode === "USER_CREATE_PROMPS") {
        return (
            <nav className="header">
                <div className="container">
                    <Typography variant="h1"> MYBETTERCSPLAN</Typography>
                    <div className="header-icons">
                        <ul>
                            <li>
                                <div onClick={colorMode.toggleColorMode}
                                     style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ?
                                        <FontAwesomeIcon icon={faSun} style={{fontSize: '15px'}}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>
                            <li>
                                <div onClick={handleMenu}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                                <Menu
                                    anchorEl={anchorMn}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem">
                                        <a style={{cursor: 'pointer', textDecoration: 'none', color: `${color}`}}
                                           href="mailto:bettercsplan@gmail.com">
                                            <FontAwesomeIcon icon={faEnvelope}/> Contact
                                        </a>
                                    </MenuItem>
                                    <MenuItem
                                        className="MenuItem"
                                        onClick={() => LogOutAction(removeCookie, navigate)}>
                                        <FontAwesomeIcon icon={faSignOut}/>
                                        {String.fromCharCode(160)} Sign Out
                                    </MenuItem>
                                </Menu>
                            </li>
                        </ul>
                    </div>
                    <div className={"header-elements"}>
                        <ul>
                            <li>
                                <div style={{cursor: 'pointer'}}>
                                    <a href="mailto:bettercsplan@gmail.com">
                                        <Typography variant="h7">
                                            <FontAwesomeIcon icon={faEnvelope}/> Contact
                                        </Typography>
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div onClick={() => LogOutAction(removeCookie, navigate)}
                                     style={{cursor: 'pointer', paddingRight: '10px'}}>
                                    <Typography variant="h7">
                                        <FontAwesomeIcon icon={faSignOut}/>
                                    </Typography>
                                </div>
                            </li>
                            <li>
                                <div onClick={colorMode.toggleColorMode} className="thmode-icon"
                                     style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ? <FontAwesomeIcon icon={faSun}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    } else if (mode === "NOT_USER_LOGIN") {
        return (
            <nav className="header">
                <div className="container">
                    <Typography variant="h1"> MYBETTERCSPLAN</Typography>
                    <div className="header-icons">
                        <ul>
                            <li>
                                <div onClick={colorMode.toggleColorMode}
                                     style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ?
                                        <FontAwesomeIcon icon={faSun} style={{fontSize: '15px'}}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>
                            <li>
                                <div onClick={handleMenu}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                                <Menu
                                    anchorEl={anchorMn}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem" onClick={() => navigate("/signup")}>
                                        <FontAwesomeIcon icon={faUserPlus}/>
                                        {String.fromCharCode(160)} Create Account
                                    </MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => navigate("/about")}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                        {String.fromCharCode(160)} About
                                    </MenuItem>
                                    <MenuItem className="MenuItem">
                                        <a style={{cursor: 'pointer', textDecoration: 'none', color: `${color}`}}
                                           href="mailto:bettercsplan@gmail.com">
                                            <FontAwesomeIcon icon={faEnvelope}/> Contact
                                        </a>
                                    </MenuItem>
                                </Menu>
                            </li>
                        </ul>
                    </div>
                    <div className="header-elements">
                        <ul>
                            <li>
                                <NavLink to="/signup">
                                    <Typography variant="h7">
                                        <FontAwesomeIcon icon={faUserPlus}/> Create Account
                                    </Typography>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about">
                                    <Typography variant="h7">
                                        <FontAwesomeIcon icon={faInfoCircle}/> About
                                    </Typography>
                                </NavLink>
                            </li>
                            <li>
                                <div style={{cursor: 'pointer'}}>
                                    <a href="mailto:bettercsplan@gmail.com">
                                        <Typography variant="h7">
                                            <FontAwesomeIcon icon={faEnvelope}/> Contact
                                        </Typography>
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div onClick={colorMode.toggleColorMode}
                                     style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ?
                                        <FontAwesomeIcon icon={faSun} style={{fontSize: '15px'}}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    } else if (mode === "NOT_USER_SIGNUP") {
        return (
            <nav className="header">
                <div className="container">
                    <Typography variant="h1"> MYBETTERCSPLAN</Typography>
                    <div className="header-icons">
                        <ul>
                            <li>
                                <div onClick={colorMode.toggleColorMode}
                                     style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ?
                                        <FontAwesomeIcon icon={faSun} style={{fontSize: '15px'}}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>
                            <li>
                                <div onClick={handleMenu}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                                <Menu
                                    anchorEl={anchorMn}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem" onClick={() => navigate("/login")}>
                                        <FontAwesomeIcon icon={faSignInAlt}/>
                                        {String.fromCharCode(160)} Login
                                    </MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => navigate("/about")}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                        {String.fromCharCode(160)} About
                                    </MenuItem>
                                    <MenuItem className="MenuItem">
                                        <a style={{cursor: 'pointer', textDecoration: 'none', color: `${color}`}}
                                           href="mailto:bettercsplan@gmail.com">
                                            <FontAwesomeIcon icon={faEnvelope}/> Contact
                                        </a>
                                    </MenuItem>
                                </Menu>
                            </li>
                        </ul>
                    </div>
                    <div className="header-elements">
                        <ul>
                            <li>
                                <NavLink to="/login">
                                    <Typography variant="h7">
                                        <FontAwesomeIcon icon={faSignInAlt}/> Login
                                    </Typography>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about">
                                    <Typography variant="h7">
                                        <FontAwesomeIcon icon={faInfoCircle}/> About
                                    </Typography>
                                </NavLink>
                            </li>
                            <li>
                                <div style={{cursor: 'pointer'}}>
                                    <a href="mailto:bettercsplan@gmail.com">
                                        <Typography variant="h7">
                                            <FontAwesomeIcon icon={faEnvelope}/> Contact
                                        </Typography>
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div onClick={colorMode.toggleColorMode} className="thmode-icon"
                                     style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ? <FontAwesomeIcon icon={faSun}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    } else if (mode === "NOT_USER_ABOUT") {
        return (
            <nav className="header">
                <div className="container">
                    <Typography variant="h1"> MYBETTERCSPLAN</Typography>
                    <div className="header-icons">
                        <ul>
                            <li>
                                <div onClick={colorMode.toggleColorMode}
                                     style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ?
                                        <FontAwesomeIcon icon={faSun} style={{fontSize: '15px'}}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>
                            <li>
                                <div onClick={handleMenu}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                                <Menu
                                    anchorEl={anchorMn}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem" onClick={() => navigate("/login")}>
                                        <FontAwesomeIcon icon={faSignInAlt}/>
                                        {String.fromCharCode(160)} Login
                                    </MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => navigate("/about")}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                        {String.fromCharCode(160)} About
                                    </MenuItem>
                                    <MenuItem className="MenuItem">
                                        <a style={{cursor: 'pointer', textDecoration: 'none', color: `${color}`}}
                                           href="mailto:bettercsplan@gmail.com">
                                            <FontAwesomeIcon icon={faEnvelope}/> Contact
                                        </a>
                                    </MenuItem>
                                </Menu>
                            </li>
                        </ul>
                    </div>
                    <div className="header-elements">
                        <ul>
                            <li>
                                <NavLink to="/login">
                                    <Typography variant="h7">
                                        <FontAwesomeIcon icon={faSignInAlt}/> Login
                                    </Typography>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about">
                                    <Typography variant="h7">
                                        <FontAwesomeIcon icon={faInfoCircle}/> About
                                    </Typography>
                                </NavLink>
                            </li>
                            <li>
                                <div style={{cursor: 'pointer'}}>
                                    <a href="mailto:bettercsplan@gmail.com">
                                        <Typography variant="h7">
                                            <FontAwesomeIcon icon={faEnvelope}/> Contact
                                        </Typography>
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div onClick={colorMode.toggleColorMode}
                                     style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ?
                                        <FontAwesomeIcon icon={faSun} style={{fontSize: '15px'}}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    } else if (mode === "NOT_FOUND") {
        return (
            <nav className="header">
                <div className="container">
                    <Typography variant="h1"> MYBETTERCSPLAN</Typography>
                    <div className="header-icons">
                        <ul>
                            <li>
                                <div>
                                    <a className="contact-icon" style={{
                                        textDecoration: 'none', color: `${color}`
                                    }} href="mailto:bettercsplan@gmail.com">
                                        <FontAwesomeIcon icon={faEnvelope}/>
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div onClick={colorMode.toggleColorMode}
                                     style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ?
                                        <FontAwesomeIcon icon={faSun} style={{fontSize: '15px'}}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={"header-elements"}>
                        <ul>
                            <li>
                                <div style={{cursor: 'pointer'}}>
                                    <a href="mailto:bettercsplan@gmail.com">
                                        <Typography variant="h7">
                                            <FontAwesomeIcon icon={faEnvelope}/> Contact
                                        </Typography>
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div onClick={colorMode.toggleColorMode} className="thmode-icon"
                                     style={{cursor: 'pointer'}}>
                                    {theme.palette.mode === 'dark' ? <FontAwesomeIcon icon={faSun}/> :
                                        <FontAwesomeIcon icon={faMoon}/>}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Header