import TableRow from "./TableRow";
import "./Table.css"
import {useEffect, useState} from "react";
import {useDrop} from "react-dnd";
function CoursesTable(props) {
    const [rows, setRows] = useState(props.courses)
    const [{isOver}, drop] = useDrop(() => ({
        accept: 'TABLE_ROW',
        drop: (draggedRow) => {
            setRows(rows => [...rows, {name: draggedRow.name, credits: draggedRow.credits}])
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    function removeRow(name) {
        setRows(rows => rows.filter(row => (row.name !== name)))
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
                    <TableRow key={row.name} name={row.name} credits={row.credits} delete={removeRow}/>)}
                </tbody>
            </table>
        </div>
    )
}

export default CoursesTable