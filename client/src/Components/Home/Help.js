import {Dialog, DialogContent, DialogContentText, Fab, useTheme} from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import React, {useState} from "react";
import {helpStyle} from "../../Themes/ThemeStyles";
import {isMobile} from "react-device-detect";

/**
 *
 * Renders a floating action button with a question mark icon. When clicked, it opens a dialog box
 * displaying directions and instructions how to use home.
 *
 * @returns {JSX.Element} - Help component with a question mark button and a dialog box.
 */

function Help() {
    const theme = useTheme();

    //boolean to track whether the dialog is open or not
    const [open, setOpen] = useState(false);

    const directions = !isMobile
        ? "Drag and drop classes from your class list to the semester tables. Alternatively, simply click on a class in " +
        "your list, click on move and, choose the desired semester. To avoid " +
        "prerequisite errors, first move your math classes, then your CS core classes, and then your CS track " +
        "classes. If you would like to see alternatives for a class in your class list, simply click on the class.\n" +
        "\nPlease note that the list of alternatives is not comprehensive."
        : "Click on a class in your list, click on move and, choose the desired semester. To avoid " +
        "prerequisite errors, first move your math classes, then your CS core classes, and then your CS track " +
        "classes. If you would like to see alternatives for a class in your class list, simply click on the class.\n" +
        "\nPlease note that the list of alternatives is not comprehensive.";


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

export default Help;