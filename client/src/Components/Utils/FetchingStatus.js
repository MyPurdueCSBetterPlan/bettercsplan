/**
 * Renders a button component to delete the user's account. When clicked, it displays a confirmation dialog
 * and if the user clicks in confirm, it will delete de account.
 *
 * @return {JSX.Element} - The rendered delete account button.
 */
import {Backdrop, CircularProgress, Grid, Typography} from "@mui/material";
import React from "react";


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