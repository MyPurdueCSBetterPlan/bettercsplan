import {amber, blue, grey} from "@mui/material/colors";
import {useTheme} from "@mui/material";
import React from "react";
import {ColorModeContext} from "./ColorModeContext";

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
            fontFamily: "Poppins, sans-serif",
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
        fontFamily: "Poppins, sans-serif",
        textDecoration: 'none',
        ...(mode === 'light'
            ? {
                h1: {
                    fontWeight: "bold",
                    color: '#000000',
                    fontSize: "30px",
                },
                h7: {
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#000000',
                },
            }
            : {
                h1: {
                    fontWeight: "bold",
                    color: '#ffffff',
                    fontSize: "30px",
                },
                h7: {
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#ffffff',
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
            color: blue[700],
            '&:hover': {
                border: '2px solid',
                background: blue[50],
            },
        }),
});

export const stepperStyle = (mode) => ({
    padding: 2,
    ...(mode === "light" ? {
        "& .Mui-active": {
            "&.MuiStepIcon-root": {
                color: "warning.main",
                fontSize: "2rem",
                fontFamily: 'Poppins, sans-serif',
                "& .MuiStepIcon-text": {
                    fill: "#ffffff",
                    fontFamily: 'Poppins, sans-serif'
                }
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: "warning.main",
                fontFamily: 'Poppins, sans-serif',
                "& .MuiStepIcon-text": {
                    fill: 'white',
                    fontFamily: 'Poppins, sans-serif'
                },
            },
            "& .MuiStepConnector-line": {
                borderColor: '#2f234f',
            },
        },
        "& .Mui-completed": {
            "&.MuiStepIcon-root": {
                color: "#2f234f",
                fontSize: "2rem",
                fontFamily: 'Poppins, sans-serif',
                "& .MuiStepIcon-text": {
                    fill: 'white',
                    fontFamily: 'Poppins, sans-serif'
                },
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: "#2f234f",
                fontFamily: 'Poppins, sans-serif'
            },
            "& .MuiStepConnector-line": {
                color: "#2f234f",
            },
        },
        "& .Mui-disabled": {
            ".MuiStepIcon-root": {
                color: "#2f234f",
                fontSize: '2rem',
                fontFamily: 'Poppins, sans-serif',
                "& .MuiStepIcon-text": {
                    fill: 'white',
                    fontFamily: 'Poppins, sans-serif'
                },
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: "#2f234f",
                fontFamily: 'Poppins, sans-serif'
            },
            "& .MuiStepConnector-line": {
                color: "#2f234f",
            }
        }
    } : {
        "& .Mui-active": {
            "&.MuiStepIcon-root": {
                color: "warning.main",
                fontSize: "2rem",
                fontFamily: 'Poppins, sans-serif',
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: "warning.main",
                fontFamily: 'Poppins, sans-serif'
            },
            "&.MuiStepConnector-line": {
                borderColor: grey[500],
            },
            "&.MuiStepIcon-text": {
                fill: 'white',
            },
        },
        "& .Mui-completed": {
            "&.MuiStepIcon-root": {
                color: grey[400],
                fontSize: "2rem",
                fontFamily: 'Poppins, sans-serif'
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: grey[400],
                fontFamily: 'Poppins, sans-serif'
            },
            "& .MuiStepConnector-line": {
                color: grey[400],
            }
        },
        "& .Mui-disabled": {
            ".MuiStepIcon-root": {
                color: grey[400],
                fontSize: '2rem',
                fontFamily: 'Poppins, sans-serif'
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: grey[400],
                fontFamily: 'Poppins, sans-serif'
            },
            "& .MuiStepConnector-line": {
                color: grey[400],
            }
        }
    })
});


