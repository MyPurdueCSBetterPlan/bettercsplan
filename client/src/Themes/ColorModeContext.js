import React from "react";


/**
 * A React context component that provides color mode information and a function to toggle the color mode.
 * The `ColorModeContext` is used to manage the color mode state throughout the page.
 */

export const ColorModeContext = React.createContext({
    colorMode: "light",
    toggleColorMode: () => {
    },
});
