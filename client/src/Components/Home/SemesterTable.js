import ClickableTableRow from "./ClickableTableRow";
import {useDrop} from "react-dnd";
import {useEffect, useState} from "react";
import {v4} from 'uuid'
import {Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";


/**
 * Renders a table for a specific semester.
 * The component also provides add, move, and remove classes options.
 *
 * @param {Object} props - The component props.
 * @param {string} props.semester - The semester name.
 * @param {number} props.index - The index of the semester.
 * @param {Array} props.courses - The array of courses for the semester.
 * @param {function} props.add - Function to add a course to the semester.
 * @param {function} props.move - Function to move a course from one semester to another.
 *
 * @returns {JSX.Element} - SemesterTable component with a table displaying the semester's courses.
 */

function SemesterTable(props) {

    //the rows displayed under the semester table
    const [rows, setRows] = useState([]);

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
                                                   }}
                                />))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

export default SemesterTable;