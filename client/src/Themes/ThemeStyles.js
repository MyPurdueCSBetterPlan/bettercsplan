import {amber, blue, grey} from "@mui/material/colors";
import {useTheme} from "@mui/material";
import React from "react";
import {ColorModeContext} from "./ColorModeContext";

//#121858 - dark indigo
//#b2b9e1 - light indigo

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
            ...(mode === 'dark' ? {
                main: amber[300],
            } : {
                main: '#121858'
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
                    color: '#121858',
                    fontSize: "30px",
                },

                h7: {
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#121858',
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
            color: "#121858",
            '&:hover': {
                border: '2px solid',
                background: '#b2b9e1',
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
                borderColor: '#121858',
            },
        },
        "& .Mui-completed": {
            "&.MuiStepIcon-root": {
                color: "#121858",
                fontSize: "2rem",
                fontFamily: 'Poppins, sans-serif',
                "& .MuiStepIcon-text": {
                    fill: 'white',
                    fontFamily: 'Poppins, sans-serif'
                },
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: "#121858",
                fontFamily: 'Poppins, sans-serif'
            },
            "& .MuiStepConnector-line": {
                color: "#121858",
            },
        },
        "& .Mui-disabled": {
            ".MuiStepIcon-root": {
                color: "#121858",
                fontSize: '2rem',
                fontFamily: 'Poppins, sans-serif',
                "& .MuiStepIcon-text": {
                    fill: 'white',
                    fontFamily: 'Poppins, sans-serif'
                },
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: "#121858",
                fontFamily: 'Poppins, sans-serif'
            },
            "& .MuiStepConnector-line": {
                color: "#121858",
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
                color: 'white',
                fontSize: "2rem",
                fontFamily: 'Poppins, sans-serif'
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: 'white',
                fontFamily: 'Poppins, sans-serif'
            },
            "& .MuiStepConnector-line": {
                color: 'white',
            }
        },
        "& .Mui-disabled": {
            ".MuiStepIcon-root": {
                color: 'white',
                fontSize: '2rem',
                fontFamily: 'Poppins, sans-serif'
            },
            "&.MuiStepLabel-alternativeLabel": {
                fontSize: '2vw',
                color: 'white',
                fontFamily: 'Poppins, sans-serif'
            },
            "& .MuiStepConnector-line": {
                color: 'white',
            }
        }
    })
});

export const helpStyle = (mode) => ({
    position: 'fixed',
    bottom: 20,
    right: 20,
})

export const textInputStyle = (mode) => ({
    marginBottom: '10px',
    ...(mode === 'light' ? {
        '& .MuiFormLabel-root': {
            color: '#121858'
        },
        '& .MuiInputBase-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#121858',
        },
        '& .MuiFocused': {
            color: '#121858'
        },
    } : {
        '& .MuiFormLabel-root': {
            color: '#ffd54f'
        },
        '& .MuiInputBase-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffd54f',
        },
        '& .MuiFocused': {
            color: '#ffd54f'
        },
    })
})

export const linkStyle = (mode) => ({
    ...(mode === 'light' ? {
        color: '#121858',
    } : {
        color: '#ffd54f'
    })
})

export const alertStyles = (theme) => ({
    ".swal2-popup": {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
    },

    ".swal2-title": {
        color: theme.palette.text.primary,
    },

    ".swal2-content": {
        color: theme.palette.text.primary,
    },
});

export const overflowListStyle = (mode) => ({
    overflow: 'auto',
    height: '40vh',
    ...(mode === 'light' ? {
        '&::-webkit-scrollbar': {
            width: '0.4em',
            backgroundColor: 'lightgrey',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#121858',
            borderRadius: '2px',
        }
    } : {
        '&::-webkit-scrollbar': {
            width: '0.4em',
            backgroundColor: 'black',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: amber[300],
            borderRadius: '2px',
        }
    })
})

export const scrollableAreaStyle = (mode) => ({
    overflow: 'auto',
    height: 'calc(100vh - 140px)',
    padding: '15px',
    '&::-webkit-scrollbar': {
        width: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: '10px',
    },
    ...(mode === 'light' ? {
        boxShadow: '0px 0px 5px #2f234f',
        '&::-webkit-scrollbar-thumb': {
            background: '#2f234f'
        }
    } : {
        boxShadow: `0px 0px 5px ${amber[300]}`,
        '&::-webkit-scrollbar-thumb': {
            background: amber[300],
        }
    })
})
