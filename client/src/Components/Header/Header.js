import React, {useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import './Header.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faBars,
    faSignInAlt,
    faInfoCircle,
    faEnvelope,
    faUserPlus,
    faArrowLeft, faMoon, faHomeAlt, faUser, faUserEdit, faSignOut
} from '@fortawesome/free-solid-svg-icons';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import {useCookies} from "react-cookie";
import {LogOutAction} from "../../Redux/Actions/GlobalActions";
import {red} from "@mui/material/colors";


const Header = ({mode}) => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [showHeader, setHeader] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleShowHeader = () => {
        setHeader(!showHeader)
    }
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };


    if (mode === "USER_VERIFIED") {
        return (
            <nav className="header">
                <div className="container">
                    <div className="logo">
                        <h1>MYBETTERCSPLAN</h1>
                    </div>
                    <div className="menu-icon">
                        <ul>
                            <li>
                                <div onClick={handleMenu}>
                                    <FontAwesomeIcon icon={faUser}/>
                                </div>
                                <Menu
                                    sx={{
                                        mt: "1px", "& .MuiMenu-paper":
                                            {backgroundColor: '#f8d588',},
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleCloseMenu}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem" onClick={() => navigate("/profile")}><FontAwesomeIcon
                                        icon={faUserEdit}/>{String.fromCharCode(160)}Profile</MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => LogOutAction(removeCookie, navigate)}><FontAwesomeIcon
                                        icon={faSignOut}/>{String.fromCharCode(160)}Sign Out</MenuItem>
                                </Menu>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faMoon}/>
                            </li>
                            <li>
                                <div onClick={handleShowHeader}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={`header-elements  ${showHeader && 'active'}`}>
                        <ul>
                            <li>
                                <NavLink to="/"><FontAwesomeIcon icon={faHomeAlt}/> Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/about"><FontAwesomeIcon icon={faInfoCircle}/> About</NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact"><FontAwesomeIcon icon={faEnvelope}/> Contact</NavLink>
                            </li>
                            <li>
                                <div onClick={handleMenu} className="account-icon" style={{cursor: 'pointer'}}>
                                    <a><FontAwesomeIcon icon={faUser}/> Account</a>
                                </div>
                                <Menu
                                    sx={{
                                        mt: "1px", "& .MuiMenu-paper":
                                            {backgroundColor: '#f8d588',},
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleCloseMenu}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem" onClick={() => navigate("/profile")}><FontAwesomeIcon
                                        icon={faUserEdit}/>{String.fromCharCode(160)}Profile</MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => LogOutAction(removeCookie, navigate)}><FontAwesomeIcon
                                        icon={faSignOut}/>{String.fromCharCode(160)}Sign Out</MenuItem>
                                </Menu>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faMoon} className="thmode-icon"/>
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
                    <div className="logo">
                        <h1>MYBETTERCSPLAN</h1>
                    </div>
                    <div className="menu-icon">
                        <ul>
                            <li>
                                <FontAwesomeIcon icon={faMoon}/>
                            </li>
                            <li>
                                <div onClick={handleShowHeader}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={`header-elements  ${showHeader && 'active'}`}>
                        <ul>
                            <li>
                                <NavLink to="/contact"><FontAwesomeIcon icon={faEnvelope}/> Contact</NavLink>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faMoon} className="thmode-icon"/>
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
                    <div className="logo">
                        <h1>MYBETTERCSPLAN</h1>
                    </div>
                    <div className="menu-icon">
                        <ul>
                            <li>
                                <FontAwesomeIcon icon={faMoon}/>
                            </li>
                            <li>
                                <div onClick={handleShowHeader}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={`header-elements  ${showHeader && 'active'}`}>
                        <ul>
                            <li>
                                <NavLink to="/signup"><FontAwesomeIcon icon={faUserPlus}/> Create Account</NavLink>
                            </li>
                            <li>
                                <NavLink to="/about"><FontAwesomeIcon icon={faInfoCircle}/> About</NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact"><FontAwesomeIcon icon={faEnvelope}/> Contact</NavLink>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faMoon} className="thmode-icon"/>
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
                    <div className="logo">
                        <h1>MYBETTERCSPLAN</h1>
                    </div>
                    <div className="menu-icon">
                        <ul>
                            <li>
                                <FontAwesomeIcon icon={faMoon}/>
                            </li>
                            <li>
                                <div onClick={handleShowHeader}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={`header-elements  ${showHeader && 'active'}`}>
                        <ul>
                            <li>
                                <NavLink to="/login"><FontAwesomeIcon icon={faSignInAlt}/> Login</NavLink>
                            </li>
                            <li>
                                <NavLink to="/about"><FontAwesomeIcon icon={faInfoCircle}/> About</NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact"><FontAwesomeIcon icon={faEnvelope}/> Contact</NavLink>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faMoon} className="thmode-icon"/>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    } else if (mode === "NOT_USER_AUTH") {
        return (
            <nav className="header">
                <div className="container">
                    <div className="logo">
                        <h1>MYBETTERCSPLAN</h1>
                    </div>
                    <div className="menu-icon">
                        <ul>
                            <li>
                                <FontAwesomeIcon icon={faMoon}/>
                            </li>
                            <li>
                                <div onClick={handleShowHeader}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={`header-elements  ${showHeader && 'active'}`}>
                        <ul>
                            <li>
                                <NavLink to="/login"><FontAwesomeIcon icon={faArrowLeft}/> Go back to Auth</NavLink>
                            </li>
                            <li>
                                <NavLink to="/about"><FontAwesomeIcon icon={faInfoCircle}/> About</NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact"><FontAwesomeIcon icon={faEnvelope}/> Contact</NavLink>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faMoon} className="thmode-icon"/>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Header