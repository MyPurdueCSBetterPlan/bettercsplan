import TableRow from "./TableRow";
import "./Table.css"
import {useEffect, useState} from "react";
import {useDrop} from "react-dnd";
import {v4} from 'uuid'
function CoursesTable(props) {
    const [rows, setRows] = useState(props.courses)
    const [, drop] = useDrop(() => ({
        accept: 'TABLE_ROW',
        drop: (draggedRow) => {
            setRows(rows => [...rows, {name: draggedRow.name, credits: draggedRow.credits}])
            if (draggedRow.index !== -1) {
                props.update(draggedRow.name)
            }
            console.log('after update')
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    function removeRow(name) {
        setRows((rows) => {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].name === name) {
                    rows.splice(i, 1)
                    break
                }
            }
            return rows
        })
    }

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
                    <TableRow key={v4()} index={-1} name={row.name} credits={row.credits} delete={removeRow}/>)}
                </tbody>
            </table>
        </div>
    )
}

export default CoursesTable