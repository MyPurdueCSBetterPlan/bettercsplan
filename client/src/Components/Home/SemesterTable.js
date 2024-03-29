import ClickableTableRow from "./ClickableTableRow";
import {useDrop} from "react-dnd";
import {useEffect, useState} from "react";
import {v4} from 'uuid'
import {Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import alert from "sweetalert2";


/**
 * Renders a table for a specific semester.
 * The component also provides add, move, and remove classes options.
 *
 * @param props - The component props.
 * @param props.semester - The semester name.
 * @param props.index - The index of the semester.
 * @param props.coursesToTake - List of courses to take.
 * @param props.courses - The array of courses for the semester.
 * @param props.add - Function to add a course to the semester.
 * @param props.remove - function that updates server data after a class is removed to the courses table.
 * @param props.move - Function to move a course from one semester to another.
 * @param props.updateListCourses - function that it will update a table of a semester locally.
 * @returns {JSX.Element} - SemesterTable component with a table displaying the semester's courses.
 */

function SemesterTable(props) {

    //the rows displayed under the semester table
    const [rows, setRows] = useState(props.courses);
    const [courses, setCourses] = useState(props.coursesToTake);


    const handleDelete = (courseName) => {
        alert.fire({
            title: `Remove ${courseName}`,
            text: "Do you want to delete this class?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                props.remove(courseName);
                removeRow(courseName);

            }
        })
    };


    //on a table row drop, the rows are updated and a certain function is called based on where the row came from
    //note that on a drop, the original table_row is deleted (look at ClickableTableRow.js)
    const [, drop] = useDrop(() => ({
        accept: 'TABLE_ROW',
        drop: async (draggedRow) => {
            setRows(rows => [...rows, {name: draggedRow.name, credits: draggedRow.credits}]);

            //row is coming from the classes table
            if (draggedRow.index === -1) {
                props.add(props.index, draggedRow.name);

                //row is coming from another semester table
            } else if (draggedRow.index !== props.index) {
                props.move(props.index, draggedRow.name);
            }

            //do nothing if draggedRow.index === props.index (row is coming from the same semester table)
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }));

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
            })
        })
    }

    //reloads the page whenever the props are fully loaded
    useEffect(() => {
        setRows(props.courses);
    }, [props.courses]);


    useEffect(() => {
        setCourses(props.coursesToTake);
    }, [props.coursesToTake]);

    return (
        <Grid item xs={12} sm={6} md={6} lg={3}>
            <TableContainer component={Paper}>
                <Table ref={drop}>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2} align='center'>{props.semester}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Class</TableCell>
                            <TableCell align='right'>Credits</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows !== null && (
                            rows.map(row =>
                                <ClickableTableRow key={v4()}
                                                   index={props.index}
                                                   name={row.name}
                                                   credits={row.credits}
                                                   delete={removeRow}
                                                   handleClick={() => {
                                                       handleDelete(row.name);
                                                   }}
                                />
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

export default SemesterTable;