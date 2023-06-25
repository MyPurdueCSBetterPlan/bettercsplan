import React, {useState} from "react";
import axios from "axios";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";
import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Grid,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer, TableRow,
    TextField, useTheme
} from "@mui/material";
import {buttonStyle, textInputStyle, overflowListStyle} from "../../Themes/ThemeStyles";
import {ColorModeContext} from "../../Themes/ColorModeContext";
import {amber, blue, grey} from "@mui/material/colors";

const {REACT_APP_SERVER_URL} = process.env;

/**
 * @param props.next - The next functional component to be rendered after classes are saved (ChooseOptions)
 * @return {JSX.Element} - Menu where the user can search for classes using a filter and select them
 * as classes they have already taken
 */

function ChooseClasses(props) {
    const [classList, setClassList] = useState([]);
    const [selected, setSelected] = useState([]);
    const theme = useTheme();
    const [showAlert, setShowAlert] = useState(false);
    const colorMode = React.useContext(ColorModeContext);

    //updates the filter value
    function handleChange(e) {

        if (e.target.value === "") {
            setClassList([])
            return
        }

        axios.post(
            `${REACT_APP_SERVER_URL}/classes`,
            {
                "filter": e.target.value
            },
            {withCredentials: true}
        )
            .then(response => {
                setClassList(response.data.classes)
            })
            .catch(error => {
                const {message} = error.data
                ErrorAction(message);
            })
    }

    //selecting a class moves it from the unselected array to the selected array
    function select(optionClicked) {
        if (!selected.includes(optionClicked)) {
            setSelected((selected) => [...selected, optionClicked]);
        } else { //Already selected
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 2000);
        }
    }

    //unselecting a class moves it from the selected array to the unselected array
    function unselect(optionClicked) {
        setSelected(selected => selected.filter(option => option !== optionClicked))
    }

    //sends array of selected classes to the server and moves on to next page if successful
    function saveClasses() {
        axios.post(
            `${REACT_APP_SERVER_URL}/taken`,
            {
                classes: selected
            },
            {withCredentials: true}
        )
            .then(props.next)
            .catch((error) => {
                const {message} = error.data
                ErrorAction(message)
            })
    }

    //empties list of selected classes
    function clearClasses() {
        setSelected([])
    }


    return (
        <Box sx={{
            '@media (max-width: 600px)': {
                width: '95%',
            },
        }}>
            <Box sx={{width: '100%', height: '8vh'}}>
                {showAlert && (
                    <Box>
                        <Alert variant="outlined" severity="error">Course already selected.</Alert>
                    </Box>
                )}
            </Box>
            <Grid container spacing={20} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={6} lg={4}>
                    <TextField
                        id="outlined-basic"
                        label="Search Filter"
                        variant="outlined"
                        onChange={handleChange}
                        autoComplete="off"
                        fullWidth
                        sx={textInputStyle(theme.palette.mode)}/>
                    <Paper variant="outlined" sx={{
                        borderColor: theme.palette.mode === 'light' ? '#121858' : amber[200],
                    }}>
                        <Box sx={overflowListStyle(theme.palette.mode)}>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        {classList.map((option, index) => (
                                            <TableRow sx={{
                                                '&:hover': {
                                                    backgroundColor: theme.palette.mode === 'light' ? '#b2b9e1' : amber[200],
                                                },
                                            }} key={index} onClick={() => select(option)}>
                                                <TableCell component="th" scope="row">
                                                    {option}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <ButtonGroup fullWidth sx={{marginBottom: '10px', height: 56}}>
                        <Button onClick={clearClasses} sx={buttonStyle(theme.palette.mode)}>Clear</Button>
                        <Button type="submit" onClick={saveClasses}
                                sx={buttonStyle(theme.palette.mode)}>Submit</Button>
                    </ButtonGroup>
                    <Paper variant="outlined" sx={{
                        borderColor: theme.palette.mode === 'light' ? '#121858' : amber[200],
                    }}>
                        <Box sx={overflowListStyle(theme.palette.mode)}>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        {selected.length > 0 ? (
                                            selected.map((option, index) => (
                                                <TableRow sx={{
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.mode === 'light' ? '#b2b9e1' : amber[200],
                                                    },
                                                }} key={index} onClick={() => unselect(option)}>
                                                    <TableCell component="th" scope="row">
                                                        {option}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={1} align="center">
                                                    Empty.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ChooseClasses