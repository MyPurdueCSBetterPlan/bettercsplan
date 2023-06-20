import * as React from 'react';
import {Box, CssBaseline, IconButton, ThemeProvider, useTheme} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {ColorModeContext} from "../../Themes/ColorModeContext";


function About() {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        borderRadius: 1,
                        p: 3,
                    }}
                >
                    {theme.palette.mode} mode
                    <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                </Box>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default About