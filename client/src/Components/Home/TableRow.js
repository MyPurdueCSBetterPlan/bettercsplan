import {useDrag} from "react-dnd";

function TableRow(props) {
    const name = props.name
    const credits = props.credits
    const index = props.index
    const [,drag] = useDrag(() => ({
        type: 'TABLE_ROW',
        item: {name, credits, index},
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