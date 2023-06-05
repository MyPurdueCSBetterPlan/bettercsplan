import TableRow from "./TableRow";
import "./Table.css"
import {useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import {v4} from 'uuid'
function CoursesTable(props) {
    const [rows, setRows] = useState(props.courses)
    const [{isOver}, drop] = useDrop(() => ({
        accept: 'TABLE_ROW',
        drop: (draggedRow) => {
            props.update(draggedRow.index, draggedRow.name, draggedRow.credits)
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    //reloads the page when courses are given from the server
    useEffect(() => {
        setRows(props.courses)
    }, [props.courses])

    return (
        <div className="table-box" ref={drop}>
            <table>
                <tbody>
                <tr>
                    <th>Class</th>
                    <th>Credits</th>
                </tr>
                {rows.map(row =>
                    <TableRow key={v4()} index={-1} name={row.name} credits={row.credits} />)}
                </tbody>
            </table>
        </div>
    )
}

export default CoursesTable