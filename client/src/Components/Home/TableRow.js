import {useDrag} from "react-dnd";

function TableRow(props) {
    const name = props.name
    const credits = props.credits
    const removeMyself = props.delete
    const [{isDragging}, drag] = useDrag(() => ({
        type: 'TABLE_ROW',
        item: {name, credits},
        end: (item, monitor) => {
            if (monitor.getDropResult()) {
                removeMyself(name)
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }))

    return (
        <tr ref={drag}>
            <td>{props.name}</td>
            <td>{props.credits}</td>
        </tr>
    )
}

export default TableRow