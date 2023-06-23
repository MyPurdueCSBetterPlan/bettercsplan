import {Dialog, DialogContent, DialogContentText, Fab, useTheme} from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import React, {useState} from "react";
import {helpStyle} from "../../Themes/ThemeStyles";

function Help() {

    const theme = useTheme();

    const [open, setOpen] = useState(false)

    const fabStyle = {
        position: 'fixed',
        bottom: 20,
        right: 20,
    }

    const directions = "Drag and drop classes from your class list to the semester tables. To avoid " +
        "prerequisite errors, first move your math classes, then your CS core classes, and then your CS track " +
        "classes. If you would like to see alternatives for a class in your class list, simply click on the class." +
        "Please note that the list of alternatives is not comprehensive."

    return (
        <>
            <Fab color='warning' aria-label="add" sx={helpStyle(theme.palette.mode)}
                 size="small" onClick={() => setOpen(true)}>
                <QuestionMarkIcon/>
            </Fab>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <DialogContentText color='primary' id="alert-dialog-description">
                        {directions}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Help