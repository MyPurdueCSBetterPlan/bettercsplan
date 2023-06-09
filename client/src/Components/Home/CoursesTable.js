import TableRow from "./TableRow";
import "./Table.css"
import {useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import {v4} from 'uuid'
import axios from "axios";
import {Dialog, DialogTitle, Grid, List, ListItem, ListItemButton, ListItemText} from "@mui/material";

const {REACT_APP_SERVER_URL} = process.env;

function CoursesTable(props) {
    const [rows, setRows] = useState(props.courses)
    const [replace, setReplace] = useState("")
    const [alternates, setAlternates] = useState([])
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

    function showAlternatives(name) {
        axios.post(
            `${REACT_APP_SERVER_URL}/schedule-alternateList`,
            {
                className: name
            },
            {withCredentials: true}
        )
            .then(response => {
                const {alternates} = response.data
                setReplace(name)
                setAlternates(alternates)
                if (alternates.length !== 0) {
                    setOpen(true)
                }
            })
    }

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

    function closeDialog() {
        setOpen(false)
    }

    return (
        <>
            <Dialog open={open} onClose={closeDialog}>
                <DialogTitle sx={{fontFamily: "'Poppins', sans-serif"}}>Choose an Alternative for {replace}</DialogTitle>
                <List>
                    {alternates.map(alternate => (
                        <ListItem disableGutters>
                            <ListItemButton onClick={() => {handleAlternateClick(alternate.name, alternate.credits)}}>
                                <ListItemText primary={alternate.name} sx={{'& .MuiTypography-root': {fontFamily:"'Poppins', sans-serif"}}}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
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