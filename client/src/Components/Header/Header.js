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
    faMoon, faHomeAlt, faUser, faUserEdit, faSignOut, faRotateRight
} from '@fortawesome/free-solid-svg-icons';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import {useCookies} from "react-cookie";
import {LogOutAction} from "../../Redux/Actions/GlobalActions";


const Header = ({mode}) => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [showHeader, setHeader] = useState(false);
    const [anchorPr, setAnchorPr] = React.useState(null);
    const [anchorMn, setAnchorMn] = React.useState(null);
    const openProfile = Boolean(anchorPr);
    const openMenu = Boolean(anchorMn);
    const navigate = useNavigate();

    const handleShowHeader = () => {
        setHeader(!showHeader)
    }
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
                    <div className="logo">
                        <h1>MYBETTERCSPLAN</h1>
                    </div>
                    <div className="header-icons">
                        <ul>
                            <li>
                                <div onClick={handleProfile}>
                                    <FontAwesomeIcon icon={faUser}/>
                                </div>
                                <Menu
                                    sx={{
                                        mt: "1px", "& .MuiMenu-paper":
                                            {backgroundColor: '#f8d588',},
                                    }}
                                    anchorEl={anchorPr}
                                    open={openProfile}
                                    onClose={handleCloseProfile}
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
                                <div onClick={handleMenu}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                                <Menu
                                    sx={{
                                        mt: "1px", "& .MuiMenu-paper":
                                            {backgroundColor: '#f8d588',},
                                    }}
                                    anchorEl={anchorMn}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem" onClick={() => navigate("/")}>
                                        <FontAwesomeIcon icon={faHomeAlt}/>{String.fromCharCode(160)}Home</MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => navigate("/about")}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>{String.fromCharCode(160)}About
                                    </MenuItem>
                                    <MenuItem className="MenuItem">
                                        <a style={{cursor: 'pointer', textDecoration: 'none', color: 'black'}}
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
                                <NavLink to="/"><FontAwesomeIcon icon={faHomeAlt}/> Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/about"><FontAwesomeIcon icon={faInfoCircle}/> About</NavLink>
                            </li>
                            <li>
                                <div style={{cursor: 'pointer'}}>
                                    <a href="mailto:bettercsplan@gmail.com">
                                        <FontAwesomeIcon icon={faEnvelope}/> Contact
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div onClick={handleProfile} className="account-icon" style={{cursor: 'pointer'}}>
                                    <a><FontAwesomeIcon icon={faUser}/> Account</a>
                                </div>
                                <Menu
                                    sx={{
                                        mt: "1px", "& .MuiMenu-paper":
                                            {backgroundColor: '#f8d588',},
                                    }}
                                    anchorEl={anchorPr}
                                    open={openProfile}
                                    onClose={handleCloseProfile}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem" onClick={() => navigate("/profile")}><FontAwesomeIcon
                                        icon={faUserEdit}/>{String.fromCharCode(160)}Profile</MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => navigate("/create")}><FontAwesomeIcon
                                        icon={faRotateRight}/>{String.fromCharCode(160)}Remake</MenuItem>
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
                    <div className="header-icons">
                        <ul>
                            <li>
                                <div>
                                    <a className="contact-icon" href="mailto:bettercsplan@gmail.com">
                                        <FontAwesomeIcon icon={faEnvelope}/>
                                    </a>
                                </div>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faMoon}/>
                            </li>
                        </ul>
                    </div>
                    <div className={"header-elements"}>
                        <ul>
                            <li>
                                <div style={{cursor: 'pointer'}}>
                                    <a href="mailto:bettercsplan@gmail.com">
                                        <FontAwesomeIcon icon={faEnvelope}/> Contact
                                    </a>
                                </div>
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
                    <div className="header-icons">
                        <ul>
                            <li>
                                <FontAwesomeIcon icon={faMoon}/>
                            </li>
                            <li>
                                <div onClick={handleMenu}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                                <Menu
                                    sx={{
                                        mt: "1px", "& .MuiMenu-paper":
                                            {backgroundColor: '#f8d588',},
                                    }}
                                    anchorEl={anchorMn}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem" onClick={() => navigate("/signup")}>
                                        <FontAwesomeIcon icon={faUserPlus}/>{String.fromCharCode(160)}Create
                                        Account</MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => navigate("/about")}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>{String.fromCharCode(160)}About
                                    </MenuItem>
                                    <MenuItem className="MenuItem">
                                        <a style={{cursor: 'pointer', textDecoration: 'none', color: 'black'}}
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
                                <NavLink to="/signup"><FontAwesomeIcon icon={faUserPlus}/> Create Account</NavLink>
                            </li>
                            <li>
                                <NavLink to="/about"><FontAwesomeIcon icon={faInfoCircle}/> About</NavLink>
                            </li>
                            <li>
                                <div style={{cursor: 'pointer'}}>
                                    <a href="mailto:bettercsplan@gmail.com">
                                        <FontAwesomeIcon icon={faEnvelope}/> Contact
                                    </a>
                                </div>
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
                    <div className="header-icons">
                        <ul>
                            <li>
                                <FontAwesomeIcon icon={faMoon}/>
                            </li>
                            <li>
                                <div onClick={handleMenu}>
                                    <FontAwesomeIcon icon={faBars}/>
                                </div>
                                <Menu
                                    sx={{
                                        mt: "1px", "& .MuiMenu-paper":
                                            {backgroundColor: '#f8d588',},
                                    }}
                                    anchorEl={anchorMn}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem className="MenuItem" onClick={() => navigate("/login")}>
                                        <FontAwesomeIcon icon={faSignInAlt}/>{String.fromCharCode(160)}Login</MenuItem>
                                    <MenuItem className="MenuItem" onClick={() => navigate("/about")}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>{String.fromCharCode(160)}About
                                    </MenuItem>
                                    <MenuItem className="MenuItem">
                                        <a style={{cursor: 'pointer', textDecoration: 'none', color: 'black'}}
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
                                <NavLink to="/login"><FontAwesomeIcon icon={faSignInAlt}/> Login</NavLink>
                            </li>
                            <li>
                                <NavLink to="/about"><FontAwesomeIcon icon={faInfoCircle}/> About</NavLink>
                            </li>
                            <li>
                                <div style={{cursor: 'pointer'}}>
                                    <a href="mailto:bettercsplan@gmail.com">
                                        <FontAwesomeIcon icon={faEnvelope}/> Contact
                                    </a>
                                </div>
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