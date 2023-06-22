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

    // Default theme mode
    const defaultTheme = 'light';

    // Gets which theme has the client from localStorage
    const storedTheme = localStorage.getItem("theme");

    // State for managing the current theme mode
    const [mode, setMode] = React.useState(storedTheme || defaultTheme);

    // Memoized color mode object
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => { // Function to toggle between light and dark mod
                const newMode = mode === 'light' ? 'dark' : 'light';
                setMode(newMode); // Update the theme mode state with the new mode.
                localStorage.setItem("theme", newMode); // Saves the actual theme in localStorage
            },
        }),
        [mode]
    );

    // Memoized color mode object and Create a new theme using the ones that are in ThemeStyle.js
    const newTheme = React.useMemo(() => {
        return createTheme(getDesignTokens(storedTheme || mode));
    }, [mode, storedTheme]);

    return {newTheme, colorMode};
};
export default ThemeMode;
