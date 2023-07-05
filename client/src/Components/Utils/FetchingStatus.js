import {Backdrop, CircularProgress, Grid, Typography} from "@mui/material";
import React from "react";

/**
 * Renders a backdrop with a circular progress indicator when fetching data. (Usually 3 seconds delay)
 * Displays an error message if an unexpected error occurs. (Server off, and among others)
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isFetching - The flag indicating if data is being fetched (from the server).
 * @param {boolean} props.unexpectedError - The flag indicating if an unexpected error occurred.
 *
 * @returns {JSX.Element} - FetchingStatus component displaying a backdrop with a circular animation.
 */

function FetchingStatus({isFetching, unexpectedError}) {
    return (
        <>
            <Backdrop
                sx={{
                    zIndex: theme => theme.zIndex.drawer + 1,
                    color: '#fff',
                }}
                open={isFetching}
            >
                <Grid container direction="column" alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={6} lg={4}>
                        <CircularProgress size={64}/>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                        {unexpectedError &&
                            <Typography variant="h1">Something went wrong...</Typography>}
                    </Grid>
                </Grid>
            </Backdrop>
        </>
    )
}

export default FetchingStatus;