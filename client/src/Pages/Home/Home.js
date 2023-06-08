import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from 'react-dnd-touch-backend'
import {isMobile} from "react-device-detect"

import axios from "axios";
import LogOut from "../../Components/LogOut"
import SemesterTable from "../../Components/Home/SemesterTable";
import "./Home.css"
import CoursesTable from "../../Components/Home/CoursesTable";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";
import {v4} from 'uuid'
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const {REACT_APP_SERVER_URL} = process.env;

function Home() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [name, setName] = useState("");
    const [coursesToTake, setCoursesToTake] = useState([])
    const [semesters, setSemesters] = useState([])
    const [schedule, setSchedule] = useState([])
    const directions = "Drag and drop classes from your class list to the semester tables. To avoid " +
        "prerequisite errors, first move your math classes, then your CS core classes, and then your CS track " +
        "classes. If you would like to see alternatives for a class in your class list, simply click on the class." +
        "Please note that the list of alternatives is not comprehensive."

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
                const {success, message, name, coursesToTake, schedule, summer} = response.data
                setName(name)
                if (success) {
                    //set boolean variable depending on whether the user is new or not
                    if (coursesToTake.length !== 0) {
                        setCoursesToTake(coursesToTake)
                        setSchedule(schedule)
                        setSemesters([])
                        if (summer) {
                            for (let i = 0; i < schedule.length; i++) {
                                if (i % 3 === 0) {
                                    setSemesters(semesters => [...semesters, "fall " + (Math.floor(i / 3) + 1)])
                                } else if (i % 3 === 1) {
                                    setSemesters(semesters => [...semesters, "spring " + (Math.floor(i / 3) + 1)])
                                } else {
                                    setSemesters(semesters => [...semesters, "summer " + (Math.floor(i / 3) + 1)])
                                }
                            }
                        } else {
                            for (let i = 0; i < schedule.length; i++) {
                                if (i % 2 === 0) {
                                    setSemesters(semesters => [...semesters, "fall " + (Math.floor(i / 2) + 1)])
                                } else {
                                    setSemesters(semesters => [...semesters, "spring " + (Math.floor(i / 2) + 1)])
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
            .then((response) => {
                const {message, success} = response.data
                if (!success) {
                    ErrorAction(message)
                }
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
            .then((response) => {
                const {message, success} = response.data
                if (!success) {
                    ErrorAction(message)
                }
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
            })
    }

    function replaceClass (oldClassName, newClassName) {
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

    return (
        <div>
            <div className="header">
                <Header mode={"USER_VERIFIED"}/>
            </div>
            <h4>
                Welcome <span>{name}</span>
            </h4>
            <h4>{directions}</h4>
            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                <div className="two-split">
                    <CoursesTable courses={coursesToTake} add={removeClass} replace={replaceClass}/>
                    <div>
                        {semesters.map((name, index) => <SemesterTable key={v4()} index={index} semester={name}
                                                                       courses={schedule[index]}
                                                                       add={addClass} move={moveClass}/>)}
                    </div>
                </div>
            </DndProvider>
            <button onClick={() => navigate("/create")}>Create new</button>
            <div className="footer">
                <Footer/>
            </div>
        </div>
    )
}

export default Home;