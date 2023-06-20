import React from "react";
import {createTheme} from "@mui/material";
import {getDesignTokens} from "./ThemeStyles";

/**
 * Custom hook for managing the theme mode and creating the MUI theme.
 *
 * The `ThemeMode` hook initializes with the local storage or the default theme
 * (light mode).
 * It provides a `colorMode` object with a `toggleColorMode` function to toggle between light and dark mode.
 *
 * @returns {{ newTheme: import("@mui/material").Theme, colorMode: { toggleColorMode: Function } }} - The new theme
 * and color mode object.
 */

const ThemeMode = () => {
    const defaultTheme = 'light';
    const storedTheme = localStorage.getItem("theme");
    const [mode, setMode] = React.useState(storedTheme || defaultTheme);

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                const newMode = mode === 'light' ? 'dark' : 'light';
                setMode(newMode);
                localStorage.setItem("theme", newMode);
            },
        }),
        [mode]
    );

    const newTheme = React.useMemo(() => {
        return createTheme(getDesignTokens(storedTheme || mode));
    }, [mode, storedTheme]);

    return {newTheme, colorMode};
};
export default ThemeMode;
