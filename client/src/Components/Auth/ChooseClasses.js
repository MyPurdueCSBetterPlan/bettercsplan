import React, {useState} from "react";
import axios from "axios";
import {ErrorAction} from "../../Redux/Actions/GlobalActions";
import {
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
import {buttonStyle} from "../../Themes/ThemeStyles";
import {ColorModeContext} from "../../Themes/ColorModeContext";

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
    const colorMode = React.useContext(ColorModeContext);

    //updates the filter value
    function handleChange(e) {

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
                ErrorAction(message)
            })
    }

    //selecting a class moves it from the unselected array to the selected array
    function select(option) {
        if (!selected.includes(option)) {
            setSelected((selected) => [...selected, option]);
        }
    }

    //unselecting a class moves it from the selected array to the unselected array
    function unselect(option) {
        setSelected(selected => selected.filter(option => option !== option))
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
            marginTop: '60px',
            '@media (max-width: 600px)': {
                width: '95%',
            },
        }}>
            <Grid container spacing={20} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={6} lg={4}>
                    <TextField
                        id="outlined-basic"
                        label="Search Filter"
                        variant="outlined"
                        onChange={handleChange}
                        autoComplete="off"
                        sx={{width: '100%', marginBottom: '10px'}}/>
                    <Paper variant="outlined" elevation={12}>
                        <Box sx={{overflow: 'auto', height: '50vh'}}>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        {classList.length > 0 ? (
                                            classList.map((option, index) => (
                                                <TableRow sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5'
                                                    }
                                                }}
                                                          key={index} onClick={() => select(option)}>
                                                    <TableCell component="th" scope="row">
                                                        {option}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={1} align="center">
                                                    Class not found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <ButtonGroup fullWidth sx={{marginBottom: '10px', height: 56}}>
                        <Button onClick={clearClasses} sx={buttonStyle(theme.palette.mode)}>Clear</Button>
                        <Button type="submit" onClick={saveClasses} sx={buttonStyle(theme.palette.mode)}>Submit</Button>
                    </ButtonGroup>
                    <TableContainer component={Paper} variant="outlined" elevation={12}>
                        <Table>
                            <TableBody>
                                {selected.length > 0 ? (
                                    selected.map((option, index) => (
                                        <TableRow sx={{
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5'
                                            }
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
                </Grid>
            </Grid>
        </Box>
    )
}

export default ChooseClasses