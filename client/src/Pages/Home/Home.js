import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from 'react-dnd-touch-backend'
import {isMobile} from "react-device-detect"
import withScrolling from 'react-dnd-scrolling'

import axios from "axios";
import SemesterTable from "../../Components/Home/SemesterTable";
import "./Home.css"
import CoursesTable from "../../Components/Home/CoursesTable";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";
import Help from '../../Components/Home/Help'
import {v4} from 'uuid'
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import {Grid, ThemeProvider} from "@mui/material";
import {createTheme} from "@mui/material/styles";

const {REACT_APP_SERVER_URL} = process.env;
const ScrollingComponent = withScrolling('div')

/**
 * @return {JSX.Element} - Home screen for a user that displays their schedule and courses to take
 * @constructor
 */
function Home() {
    const navigate = useNavigate()

    //cookies for user authentication purposes
    const [cookies, setCookie, removeCookie] = useCookies(["token"])

    //array of objects where each object represents a course (has "name" and "credits" properties)
    const [coursesToTake, setCoursesToTake] = useState([])

    //array of the names of the semesters in the user's schedule
    const [semesters, setSemesters] = useState([])

    //array of arrays of objects where each object represents a course (has "name" and "credits" properties)
    const [schedule, setSchedule] = useState([])

    //Checks if the user is logged in or not
    useEffect(() => {

        //if no token exists, go to login page
        if (cookies.token === undefined || !cookies.token) {
            navigate("/login");
            return;
        }

        //sends post req to see if token is valid and if the user is new and acts accordingly
        // either displays the user's schedule, goes back to login page, or takes them to create page
        axios.post(
            `${REACT_APP_SERVER_URL}`,
            {},
            {withCredentials: true}
        )
            .then((response) => {
                const {success, message, coursesToTake, schedule, summer} = response.data
                if (success) {
                    //set boolean variable depending on whether the user is new or not
                    if (coursesToTake.length !== 0) {
                        setCoursesToTake(coursesToTake)
                        setSchedule(schedule)
                        setSemesters([])
                        if (summer) {
                            for (let i = 0; i < schedule.length; i++) {
                                if (i % 3 === 0) {
                                    setSemesters(semesters => [...semesters, "Fall " + (Math.floor(i / 3) + 1)])
                                } else if (i % 3 === 1) {
                                    setSemesters(semesters => [...semesters, "Spring " + (Math.floor(i / 3) + 1)])
                                } else {
                                    setSemesters(semesters => [...semesters, "Summer " + (Math.floor(i / 3) + 1)])
                                }
                            }
                        } else {
                            for (let i = 0; i < schedule.length; i++) {
                                if (i % 2 === 0) {
                                    setSemesters(semesters => [...semesters, "Fall " + (Math.floor(i / 2) + 1)])
                                } else {
                                    setSemesters(semesters => [...semesters, "Spring " + (Math.floor(i / 2) + 1)])
                                }
                            }
                        }
                    } else {
                        navigate("/create")
                    }
                } else {
                    if (message !== null && message !== undefined) {
                        ErrorAction(message);
                    }
                    removeCookie("token", [])
                    navigate("/signup")
                }
            })
            .catch(() => {
                removeCookie("token", []);
                navigate("/login");
            })
    }, [cookies, navigate, removeCookie]);


    //called whenever a class is added from the courses table to a semester table
    function addClass(semIndex, className) {
        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-add`,
            {
                semIndex: semIndex,
                className: className
            },
            {withCredentials: true}
        )
            .then((response) => {
                const {message, success, coursesToTake, schedule} = response.data
                if (!success) {
                    ErrorAction(message)
                    setCoursesToTake(coursesToTake)
                    setSchedule(schedule)
                }
            })
            .catch(error => {
                const {message} = error.data
                ErrorAction(message)
            })
    }

    //called whenever a class is moved from a semester table back to the courses table
    function removeClass(className) {
        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-remove`,
            {
                className: className
            },
            {withCredentials: true}
        )
            .catch(error => {
                const {message} = error.data
                ErrorAction(message)
            })
    }

    //called when a class is moved from one semester table to another
    async function moveClass(semIndex, className) {
        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-remove`,
            {
                className: className
            },
            {withCredentials: true}
        )
            .then(() => {
                axios.post(
                    `${REACT_APP_SERVER_URL}/schedule-add`,
                    {
                        semIndex: semIndex,
                        className: className
                    },
                    {withCredentials: true}
                )
                    .then((response) => {
                        const {message, success, coursesToTake, schedule} = response.data
                        if (!success) {
                            ErrorAction(message)
                            setCoursesToTake(coursesToTake)
                            setSchedule(schedule)
                        }
                    })
                    .catch(error => {
                        const {message} = error.data
                        ErrorAction(message)
                    })
            })
            .catch(error => {
                const {message} = error.data
                ErrorAction(message)
            })
    }

    function replaceClass(oldClassName, newClassName) {
        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-replace`,
            {
                oldClassName: oldClassName,
                newClassName: newClassName
            },
            {withCredentials: true}
        )
            .then((response) => {
                const {message, success} = response.data
                if (!success) {
                    ErrorAction(message)
                }
            })
    }

    function replaceSequence(oldClassNames, newClassNames) {
        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-replace-sequence`,
            {
                oldClassNames: oldClassNames,
                newClassNames: newClassNames
            },
            {withCredentials: true}
        )
            .then((response) => {
                const {message, success} = response.data
                if (!success) {
                    ErrorAction(message)
                }
            })
    }


    return (
        <>
            <div className="header">
                <Header mode={"USER_VERIFIED"}/>
            </div>
            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                <ScrollingComponent className='scrollable-area'>
                    <Grid container justifyContent="center">
                        <Grid container item xs={6} sm={6} md={3} alignItems="center" direction="column">
                            <CoursesTable courses={coursesToTake} add={removeClass} replace={replaceClass}
                                          replaceSequence={replaceSequence}/>
                        </Grid>
                        <Grid container item xs={6} sm={6} md={9} rowSpacing={10}>
                            {semesters.map((name, index) => <SemesterTable key={v4()} index={index} semester={name}
                                                                           courses={schedule[index]} add={addClass}
                                                                           move={moveClass}/>)}
                        </Grid>
                    </Grid>
                </ScrollingComponent>
            </DndProvider>
            <div className="footer">
                <Footer/>
            </div>
            <Help/>
        </>
    )
}

export default Home;