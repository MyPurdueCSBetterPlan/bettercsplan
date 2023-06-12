import TableRow from "./TableRow";
import "./Table.css"
import {useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import {v4} from 'uuid'
import axios from "axios";
import {Dialog, DialogTitle, Grid, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";

const {REACT_APP_SERVER_URL} = process.env;

/**
 * @param props.courses - array of course objects, each object has "name" and "credits" properties
 * @param props.add - function that updates server data after a class is added to the courses table
 * @param props.replace - function that updates server data after a class is replaced with its alternative
 * @return {JSX.Element} - table that displays all the courses the user needs to take
 */
function CoursesTable(props) {

    //rows displayed under the courses table
    const [rows, setRows] = useState(props.courses)

    //class(es) that alternatives are listed for
    const [replace, setReplace] = useState("")

    //used to track whether the current class to "replace" is part of a lab sequence
    const [isLab, setIsLab] = useState(false)

    //alternatives for clicked class
    const [alternates, setAlternates] = useState([])

    //on a table_row drop, the rows are updated and the add function is called (updates server data)
    //note that on a drop, the original table_row is deleted (look at TableRow.js)
    const [, drop] = useDrop(() => ({
        accept: 'TABLE_ROW',
        drop: (draggedRow) => {
            setRows(rows => [...rows, {name: draggedRow.name, credits: draggedRow.credits}])
            if (draggedRow.index !== -1) {
                props.add(draggedRow.name)
            }
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    //boolean to track whether the dialog is open or not
    const [open, setOpen] = useState(false)

    //removes only THE FIRST OCCURRENCE of the row that has the given name
    function removeRow(name) {
        setRows((rows) => {
            let matchDeleted = false;
            return rows.filter((row) => {
                if (!matchDeleted && row.name === name) {
                    matchDeleted = true;
                    return false;
                }
                return true;
            });
        });
    }

    //reloads the page when courses are given from the server
    useEffect(() => {
        setRows(props.courses)
    }, [props.courses])


    //shows the user a list of alternatives for the class w/ the name given by the argument
    function showAlternatives(name) {
        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-alternateList`,
            {
                className: name
            },
            {withCredentials: true}
        )
            .then(response => {
                const {isLab, alternates, replacements} = response.data
                if (!isLab) {
                    setIsLab(false)
                    setReplace(name)
                    setAlternates(alternates)
                    if (alternates.length !== 0) {
                        setOpen(true)
                    }
                }
                else {
                    setIsLab(true)
                    setReplace(replacements)
                    setAlternates(alternates)
                    if (alternates.length !== 0) {
                        setOpen(true)
                    }
                }

            })
            .catch(error => {
                const {message} = error.data
                ErrorAction(message)
            })
    }

    //updates table rows and tells the server to update data when an alternate is clicked
    function handleAlternateClick(alternateName, alternateCredits) {
        setOpen(false)
        props.replace(replace, alternateName)
        setRows(rows => {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].name === replace) {
                    rows[i].name = alternateName
                    rows[i].credits = alternateCredits
                }
            }
            return rows
        })
    }

    function handleAlternateClickSequence(alternates) {
        setOpen(false)
        props.replaceSequence(replace, alternates.map(alt => alt.name))
        for (let i = 0; i < replace.length; i++) {
            setRows(rows => {
                for (let j = 0; j < rows.length; j++) {
                    if (rows[j].name === replace[i]) {
                        rows[j].name = alternates[i].name
                        rows[j].credits = alternates[i].credits
                    }
                }
                return rows
            })
        }
    }

    //closes the dialog
    function closeDialog() {
        setOpen(false)
    }

    return (
        <>
            <Dialog open={open} onClose={closeDialog}>
                {isLab ?
                    (<DialogTitle sx={{fontFamily: "'Poppins', sans-serif"}}>Choose an alternative for {replace.length === 1 ? (replace) : (replace[0] + " + " + replace[1])}</DialogTitle>) :
                    (<DialogTitle sx={{fontFamily: "'Poppins', sans-serif"}}>Choose an Alternative for {replace}</DialogTitle>)}
                <List>
                    {isLab ?
                        (alternates.map(altSequence => (
                            <ListItem disableGutters>
                                <ListItemButton onClick={() => {handleAlternateClickSequence(altSequence)}}>
                                    <ListItemText primary={altSequence.length === 1 ? (altSequence[0].name) :  (altSequence[0].name + " " + altSequence[1].name)}/>
                                </ListItemButton>
                            </ListItem>
                        ))) :
                        (alternates.map(alternate => (
                            <ListItem disableGutters>
                                <ListItemButton onClick={() => {handleAlternateClick(alternate.name, alternate.credits)}}>
                                    <ListItemText primary={alternate.name} sx={{'& .MuiTypography-root': {fontFamily:"'Poppins', sans-serif"}}}/>
                                </ListItemButton>
                            </ListItem>
                        )))}

                </List>
            </Dialog>
            <Grid item ref={drop}>
                <table className='course-table'>
                    <tbody>
                    <tr>
                        <th colSpan='2'>Courses to Take</th>
                    </tr>
                    <tr>
                        <th>Class</th>
                        <th>Credits</th>
                    </tr>
                    {rows.map(row =>
                        <TableRow key={v4()} index={-1} name={row.name} credits={row.credits} delete={removeRow}
                                  handleClick={showAlternatives}/>
                    )}
                    </tbody>
                </table>
            </Grid>
        </>

    )
}

export default CoursesTable