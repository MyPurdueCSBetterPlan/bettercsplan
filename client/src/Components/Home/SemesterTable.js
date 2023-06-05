import "./Table.css"
import TableRow from "./TableRow";
import {useDrop} from "react-dnd";
import {useEffect, useState} from "react";
import {v4} from 'uuid'

function SemesterTable(props) {
    const index = props.index
    const update = props.update

    const [rows, setRows] = useState([])

    const [, drop] = useDrop(() => ({
        accept: 'TABLE_ROW',
        drop: (draggedRow) => {
            setRows(rows => [...rows, {name: draggedRow.name, credits: draggedRow.credits}])
            if (draggedRow.index !== index) {
                update(index, draggedRow.name, draggedRow.credits)
            }
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    //removes only THE FIRST OCCURRENCE of the row that has the given name
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

    //reloads the page whenever the props are fully loaded
    useEffect(() => {
        setRows(props.courses)
        console.log(props.courses)
    }, [props.courses])

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
                        <TableRow key={v4()} index={index} name={row.name} credits={row.credits} delete={removeRow}/>)}
                </tbody>
            </table>
        </div>
    )
}

export default SemesterTable