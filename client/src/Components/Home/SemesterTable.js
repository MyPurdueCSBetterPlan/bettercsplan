import "./Table.css"
import TableRow from "./TableRow";
import {useDrop} from "react-dnd";
import {useEffect, useState} from "react";
import {v4} from 'uuid'
import {Grid} from "@mui/material";

function SemesterTable(props) {
    const index = props.index
    const add = props.add
    const move = props.move

    const [rows, setRows] = useState([])

    const [, drop] = useDrop(() => ({
        accept: 'TABLE_ROW',
        drop: async (draggedRow) => {
            setRows(rows => [...rows, {name: draggedRow.name, credits: draggedRow.credits}])
            if (draggedRow.index === -1) {
                add(index, draggedRow.name)

                console.log("CALLED UPDATE")
            } else if (draggedRow.index !== index) {
                move(index, draggedRow.name)
                console.log("CALLED MOVE")
            } else {
                console.log("NOTHING")
            }
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
                    <TableRow key={v4()} index={index} name={row.name} credits={row.credits} delete={removeRow}/>)}
                </tbody>
            </table>
        </Grid>
    )
}

export default SemesterTable