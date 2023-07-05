import {useDrag} from "react-dnd";
import {TableCell, TableRow} from "@mui/material";

/**
 *
 * @param props.name - name of the class
 * @param props.credits - credit hours of the class
 * @param props.index - index representative of the table that the TableRow belongs to
 *                      (-1 for courses table, 0 to ? for semester tables)
 * @param props.handleClick - callback function for when row is clicked (shows class alternatives if any)
 * @param props.delete - deletes this TableRow
 * @return {JSX.Element} - row (class name + credits) for a table (either CoursesTable or SemesterTable)
 */

function ClickableTableRow(props) {
    const name = props.name;
    const credits = props.credits;
    const index = props.index;
    const [, drag] = useDrag(() => ({
        type: 'TABLE_ROW',
        item: {name, credits, index},
        end: (item, monitor) => {
            console.log(monitor.getDropResult());
            if (monitor.getDropResult()) {
                props.delete(name);
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }));

    return (
        <TableRow ref={drag} onClick={() => props.handleClick(name)}>
            <TableCell>{name}</TableCell>
            <TableCell align='right'>{credits}</TableCell>
        </TableRow>
    )
}

export default ClickableTableRow