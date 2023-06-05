import "./Table.css"
import TableRow from "./TableRow";
import {useDrop} from "react-dnd";
import {useEffect, useState} from "react";
import {v4} from 'uuid'

function SemesterTable(props) {
    const index = props.index
    const update = props.update
    const courses = props.courses

    const [rows, updateRows] = useState([])

    const [, drop] = useDrop(() => ({
        accept: 'TABLE_ROW',
        drop: (draggedRow) => {
            update(index, draggedRow.name, draggedRow.credits)
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    //reloads the page whenever the props are fully loaded
    useEffect(() => {
        updateRows(courses)
    }, [props, courses])

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
                        <TableRow key={v4()} index={index} name={row.name} credits={row.credits} />)}
                </tbody>
            </table>
        </div>
    )
}

export default SemesterTable