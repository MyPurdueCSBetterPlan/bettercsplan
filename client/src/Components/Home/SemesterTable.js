import "./Table.css"
import TableRow from "./TableRow";
import {useDrop} from "react-dnd";
import {useEffect, useState} from "react";
import {v4} from 'uuid'
import {Grid} from "@mui/material";

function SemesterTable(props) {

    //the rows displayed under the semester table
    const [rows, setRows] = useState([])

    //on a table row drop, the rows are updated and a certain function is called based on where the row came from
    //note that on a drop, the original table_row is deleted (look at TableRow.js)
    const [, drop] = useDrop(() => ({
        accept: 'TABLE_ROW',
        drop: async (draggedRow) => {
            setRows(rows => [...rows, {name: draggedRow.name, credits: draggedRow.credits}])

            //row is coming from the classes table
            if (draggedRow.index === -1) {
                props.add(props.index, draggedRow.name)

            //row is coming from another semester table
            } else if (draggedRow.index !== props.index) {
                props.move(props.index, draggedRow.name)
            }

            //do nothing if draggedRow.index === props.index (row is coming from the same semester table)
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    //removes only THE FIRST OCCURRENCE of the row that has the given name
    function removeRow(name) {
        setRows((rows) => {
            let matchDeleted = false;
            return rows.filter((row) => {
                if (!matchDeleted && row.name === name) {
                    matchDeleted = true
                    return false
                }
                return true
            })
        })
    }

    //reloads the page whenever the props are fully loaded
    useEffect(() => {
        setRows(props.courses)
        console.log(props.courses)
    }, [props.courses])

    return (
        <Grid item xs={12} sm={6} md={3} sx={{textAlign: 'center'}}>
            <table ref={drop}>
                <tbody>
                <tr>
                    <th colSpan='2'>{props.semester}</th>
                </tr>
                <tr>
                    <th>Class</th>
                    <th>Credits</th>
                </tr>
                {}
                {rows.map(row =>
                    <TableRow key={v4()} index={props.index} name={row.name} credits={row.credits} delete={removeRow}
                              handleClick={() => {}}/>)}
                </tbody>
            </table>
        </Grid>
    )
}

export default SemesterTable