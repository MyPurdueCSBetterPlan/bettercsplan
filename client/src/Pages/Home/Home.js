import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import withScrolling, {createVerticalStrength} from 'react-dnd-scrolling'
import axios from "axios";
import SemesterTable from "../../Components/Home/SemesterTable";
import CoursesTable from "../../Components/Home/CoursesTable";
import {ErrorAction} from "../../Themes/Actions/GlobalActions";
import Help from '../../Components/Home/Help'
import {v4} from 'uuid'
import Header from "../../Components/Header/Header";
import {Box, Grid, useTheme} from "@mui/material";
import {scrollableAreaStyle} from "../../Themes/ThemeStyles";
import FetchingStatus from "../../Components/Utils/FetchingStatus";


const {REACT_APP_SERVER_URL} = process.env;
const ScrollingComponent = withScrolling('div');
const vStrength = createVerticalStrength(600);

/**
 * @return {JSX.Element} - Home screen for a user that displays their schedule and courses to take
 * @constructor
 */
function Home() {
    const theme = useTheme();

    const navigate = useNavigate();

    //cookies for user authentication purposes
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    //array of objects where each object represents a course (has "name" and "credits" properties)
    const [coursesToTake, setCoursesToTake] = useState([]);

    //array of the names of the semesters in the user's schedule
    const [semesters, setSemesters] = useState([]);

    //array of arrays of objects where each object represents a course (has "name" and "credits" properties)
    const [schedule, setSchedule] = useState([]);
    const [scheduleUpdated, setScheduleUpdated] = useState(0);


    //Loading status page
    const [isFetching, setIsFetching] = useState(false);
    const [unexpectedError, setUnexpectedError] = useState(false);
    const fetchingTimeout = 3000;


    //Checks if the user is logged in or not
    useEffect(() => {

        //if no token exists, go to login page
        if (cookies.token === undefined || !cookies.token) {
            navigate("/login");
            return;
        }

        const loadingDelay = setTimeout(() => {
            setIsFetching(true);
        }, fetchingTimeout);

        //sends post req to see if token is valid and if the user is new and acts accordingly
        // either displays the user's schedule, goes back to login page, or takes them to create page
        axios.post(
            `${REACT_APP_SERVER_URL}`,
            {},
            {withCredentials: true}
        )
            .then((response) => {
                clearTimeout(loadingDelay); // Clear the loading delay timer
                const {success, message, coursesToTake, schedule, summer} = response.data;
                if (success) {
                    //set boolean variable depending on whether the user is new or not
                    if (coursesToTake.length !== 0) {
                        setCoursesToTake(coursesToTake);
                        setSchedule(schedule);
                        setSemesters([]);
                        if (summer) {
                            for (let i = 0; i < schedule.length; i++) {
                                if (i % 3 === 0) {
                                    setSemesters(semesters => [...semesters, "Fall " + (Math.floor(i / 3) + 1)]);
                                } else if (i % 3 === 1) {
                                    setSemesters(semesters => [...semesters, "Spring " + (Math.floor(i / 3) + 1)]);
                                } else {
                                    setSemesters(semesters => [...semesters, "Summer " + (Math.floor(i / 3) + 1)]);
                                }
                            }
                        } else {
                            for (let i = 0; i < schedule.length; i++) {
                                if (i % 2 === 0) {
                                    setSemesters(semesters => [...semesters, "Fall " + (Math.floor(i / 2) + 1)]);
                                } else {
                                    setSemesters(semesters => [...semesters, "Spring " + (Math.floor(i / 2) + 1)]);
                                }
                            }
                        }
                    } else {
                        navigate("/create");
                    }
                } else {
                    if (message !== null && message !== undefined) {
                        ErrorAction(message);
                    }
                    removeCookie("token", [])
                    navigate("/signup");
                }
            })
            .catch(() => {
                setSemesters(null);
                setCoursesToTake(null);
                setSchedule(null);
                setIsFetching(true);
                setUnexpectedError(true);
            })
            .finally(() => setIsFetching(false));
    }, [cookies, navigate, removeCookie, scheduleUpdated]);


    //It will update the schedule of a semester. Called whenever you need to update a table locally.
    const handleScheduleUpdate = () => {
        // Increment the scheduleUpdated state to trigger a re-render
        setScheduleUpdated(scheduleUpdated + 1);
    };


    //called whenever a class is added from the courses table to a semester table
    function addClass(semIndex, className) {
        const loadingDelay = setTimeout(() => {
            setIsFetching(true);
        }, fetchingTimeout);

        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-add`,
            {
                semIndex: semIndex,
                className: className,
                move: false,
            },
            {withCredentials: true}
        )
            .then((response) => {
                clearTimeout(loadingDelay); // Clear the loading delay timer
                const {message, success, coursesToTake, schedule} = response.data;
                if (!success) {
                    ErrorAction(message);
                    setCoursesToTake(coursesToTake);
                    setSchedule(schedule);
                } else {
                    handleScheduleUpdate();
                }
            })
            .catch(() => {
                setSemesters(null);
                setCoursesToTake(null);
                setSchedule(null);
                setIsFetching(true);
                setUnexpectedError(true);
            })
            .finally(() => setIsFetching(false));
    }


    //called whenever a class is moved from a semester table back to the courses table
    function removeClass(className) {
        const loadingDelay = setTimeout(() => {
            setIsFetching(true);
        }, fetchingTimeout);

        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-remove`,
            {
                className: className,
            },
            {withCredentials: true}
        )
            .then((response) => {
                clearTimeout(loadingDelay); // Clear the loading delay timer
                const {message, success, coursesToTake, schedule} = response.data;
                if (!success) {
                    ErrorAction(message);
                    setCoursesToTake(coursesToTake);
                    setSchedule(schedule);
                } else {
                    handleScheduleUpdate();
                }
            })
            .catch(() => {
                setSemesters(null);
                setCoursesToTake(null);
                setSchedule(null);
                setIsFetching(true);
                setUnexpectedError(true);
            })
            .finally(() => setIsFetching(false));
    }

    //called when a class is moved from one semester table to another
    async function moveClass(semIndex, className) {
        const loadingDelay = setTimeout(() => {
            setIsFetching(true);
        }, fetchingTimeout);

        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-move`,
            {
                semIndex: semIndex,
                className: className,
                move: true,
            },
            {withCredentials: true}
        )
            .then(response => {
                clearTimeout(loadingDelay); // Clear the loading delay timer
                const {message, success, schedule} = response.data;
                if (!success) {
                    ErrorAction(message);
                    setSchedule(schedule);
                } else {
                    handleScheduleUpdate();
                }
            })
            .catch(() => {
                setSemesters(null);
                setCoursesToTake(null);
                setSchedule(null);
                setIsFetching(true);
                setUnexpectedError(true);
            })
            .finally(() => setIsFetching(false));
    }

    function replaceClass(oldClassName, newClassName) {
        const loadingDelay = setTimeout(() => {
            setIsFetching(true);
        }, fetchingTimeout);

        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-replace`,
            {
                oldClassName: oldClassName,
                newClassName: newClassName,
            },
            {withCredentials: true}
        )
            .then((response) => {
                clearTimeout(loadingDelay); // Clear the loading delay timer
                const {message, success} = response.data;
                if (!success) {
                    ErrorAction(message);
                }
            })
            .catch(() => {
                setSemesters(null);
                setCoursesToTake(null);
                setSchedule(null);
                setIsFetching(true);
                setUnexpectedError(true);
            })
            .finally(() => setIsFetching(false));
    }

    function replaceSequence(oldClassNames, newClassNames) {
        const loadingDelay = setTimeout(() => {
            setIsFetching(true);
        }, fetchingTimeout);

        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-replace-sequence`,
            {
                oldClassNames: oldClassNames,
                newClassNames: newClassNames,
            },
            {withCredentials: true}
        )
            .then((response) => {
                clearTimeout(loadingDelay); // Clear the loading delay timer
                const {message, success} = response.data;
                if (!success) {
                    ErrorAction(message);
                }
            })
            .catch(() => {
                setSemesters(null);
                setCoursesToTake(null);
                setSchedule(null);
                setIsFetching(true);
                setUnexpectedError(true);
            })
            .finally(() => setIsFetching(false));
    }


    return (
        <>
            <Grid container spacing={2} direction='column'>
                <Grid item xs={12} sm={6} lg={4}>
                    <Header mode={"USER_VERIFIED"}/>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Box sx={scrollableAreaStyle(theme.palette.mode)}>
                        <DndProvider backend={HTML5Backend}>
                            <ScrollingComponent verticalStrength={vStrength}
                                                style={{marginTop: '10px', paddingBottom: '20px'}}>
                                <Grid container justifyContent="center" spacing={6}>
                                    <CoursesTable courses={coursesToTake}
                                                  add={addClass}
                                                  remove={removeClass}
                                                  semesters={semesters}
                                                  schedule={schedule}
                                                  replace={replaceClass}
                                                  replaceSequence={replaceSequence}
                                                  setIsFetching={setIsFetching}
                                                  setUnexpectedError={setUnexpectedError}
                                    />
                                    <Grid container item xs={6} sm={6} md={9} spacing={2}>
                                        {semesters !== null && (
                                            semesters.map((name, index) =>
                                                <SemesterTable
                                                    key={v4()}
                                                    index={index}
                                                    coursesToTake={coursesToTake}
                                                    semester={name}
                                                    courses={schedule[index]}
                                                    add={addClass}
                                                    remove={removeClass}
                                                    move={moveClass}
                                                />)
                                        )}

                                    </Grid>
                                </Grid>
                            </ScrollingComponent>
                        </DndProvider>
                    </Box>
                </Grid>
            </Grid>
            <Help/>
            <FetchingStatus isFetching={isFetching} unexpectedError={unexpectedError}/>
        </>
    )
}

export default Home;