import {useDrag} from "react-dnd";

function TableRow(props) {
    const name = props.name
    const credits = props.credits
    const index = props.index
    const removeMyself = props.delete
    const handleClick = props.handleClick
    const [, drag] = useDrag(() => ({
        type: 'TABLE_ROW',
        item: {name, credits, index},
        end: (item, monitor) => {
            console.log(monitor.getDropResult())
            if (monitor.getDropResult()) {
                removeMyself(name)
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }))

    return (
        <tr ref={drag} onClick={() => handleClick(name)}>
            <td>{name}</td>
            <td>{credits}</td>
        </tr>
    )
}

export default TableRow