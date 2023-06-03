import "./Table.css"
import TableRow from "./TableRow";
import {useDrop} from "react-dnd";
import {useEffect, useState} from "react";

function SemesterTable(props) {
    const index = props.index
    const update = props.update
    const courses = props.courses

    const [rows, updateRows] = useState([])

    function removeRow(name) {
        updateRows(rows => rows.filter(row => (row.name !== name)))
    }

    const [, drop] = useDrop(() => ({
        accept: 'TABLE_ROW',
        drop: (draggedRow) => {
            updateRows(rows => [...rows, {name: draggedRow.name, credits: draggedRow.credits}])
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    //calls the update in Home.js whenever the table is changed
    useEffect(() => {
        const classNames = rows.map(row => row.name)
        update(index, classNames)
    }, [rows, index, update])

    //reloads the page whenever the props are fully loaded
    useEffect(() => {
        updateRows(courses)
        console.log(courses)
    }, [props])

    return (
        <div className="table-box" ref={drop}>
            <p className="table-title">{props.semester}</p>
            <table>
                <tbody>
                    <tr>
                        <th>Class</th>
                        <th>Credits</th>
                    </tr>
                    {}
                    {rows.map(row =>
                        <TableRow key={row.name} name={row.name} credits={row.credits} delete={removeRow}/>)}
                </tbody>
            </table>
        </div>
    )
}

export default SemesterTable