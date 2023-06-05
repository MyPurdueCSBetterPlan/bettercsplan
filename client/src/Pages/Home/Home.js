import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import axios from "axios";
import LogOut from "../../Components/LogOut"
import SemesterTable from "../../Components/Home/SemesterTable";
import "./Home.css"
import CoursesTable from "../../Components/Home/CoursesTable";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";
import {v4} from 'uuid'

const {REACT_APP_SERVER_URL} = process.env;

function Home() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies(["token"]);
    const [name, setName] = useState("");
    const [coursesToTake, setCoursesToTake] = useState([])
    const [semesters, setSemesters] = useState([])
    const [schedule, setSchedule] = useState([])

    //Checks if the user is logged in or not
    useEffect(() => {

        //if no token exists, go to login page
        if (cookies.token === null) {
            navigate("/login")
            return
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
                        console.log("existing user")
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
                        console.log("new user")
                        navigate("/create")
                    }
                } else {
                    if (message !== null && message !== undefined) {
                        ErrorAction(message);
                    }
                    removeCookie("token", [])
                    navigate("/login")
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
        console.log("remove called")
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

    return (
        <>
            <h4>
                Welcome <span>{name}</span>
            </h4>
            <DndProvider backend={HTML5Backend}>
                <div className="two-split">
                    <CoursesTable courses={coursesToTake} update={removeClass}/>
                    <div>
                        {semesters.map((name, index) => <SemesterTable key={v4()} index={index} semester={name}
                                                                       courses={schedule[index]}
                                                                       update={addClass}/>)}
                    </div>
                </div>
            </DndProvider>
            <button onClick={() => navigate("/create")}>Create new</button>
            <button onClick={() => navigate("/profile")}>Profile Settings</button>
            <LogOut/>
        </>
    )
}

export default Home;