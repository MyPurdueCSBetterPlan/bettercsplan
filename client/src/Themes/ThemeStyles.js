import {amber, grey} from "@mui/material/colors";
import React from "react";

/**
 * Custom Palette dark/light mode
 *
 * This function returns design tokens for a custom palette based on the specified mode (dark or light).
 *
 * @param {string} mode - The mode (dark or light) for which to generate the design tokens.
 * @returns {object} The design tokens object with palette and typography settings and buttons.
 */

export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            ...amber,
            ...(mode === 'dark' && {
                main: amber[300],
            }),
        },
        ...(mode === 'dark' && {
            background: {
                default: grey[900],
                paper: grey[900],
            },
        }),
        text: {
            ...(mode === 'light'
                ? {
                    primary: grey[900],
                    secondary: grey[800],
                }
                : {
                    primary: '#fff',
                    secondary: grey[500],
                }),
        },
    },
    typography: {
        ...(mode === 'light'
            ? {
                h1: {
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: "bold",
                    color: '#000000',
                    fontSize: "30px",
                },
                h7: {
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#000000',
                    textDecoration: 'none',
                },
            }
            : {
                h1: {
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: "bold",
                    color: '#ffffff',
                    fontSize: "30px",
                },
                h7: {
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#ffffff',
                    textDecoration: 'none',
                },
            }),
    },
});

export const buttonStyle = (mode) => ({
    ...(mode === 'dark'
        ? {
            border: '2px solid',
            '&:hover': {
                border: '2px solid',
            },
        }
        : {
            border: '2px solid',
            background: amber[300],
            color: '#ffffff',
            '&:hover': {
                border: '2px solid',
                background: amber[400],
            },
        }),
});

