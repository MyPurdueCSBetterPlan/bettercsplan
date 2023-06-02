import "./Table.css"
import TableRow from "./TableRow";
import {useDrop} from "react-dnd";
import {useState} from "react";

function SemesterTable(props) {
    const [rows, updateRows] = useState([])

    function removeRow(name) {
        updateRows(rows => rows.filter(row => (row.name !== name)))
    }

    const [{isOver}, drop] = useDrop(() => ({
        accept: 'TABLE_ROW',
        drop: (draggedRow) => {
            updateRows(rows => [...rows, {name: draggedRow.name, credits: draggedRow.credits}])
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))
    return (
        <div className="table-box" ref={drop}>
            <p className="table-title">{props.semester}</p>
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

export default SemesterTable