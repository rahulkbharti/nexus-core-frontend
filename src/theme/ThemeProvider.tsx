import { createTheme } from "@mui/material/styles";
import type { ThemeOptions, PaletteMode } from "@mui/material/styles";
// Define the custom theme interface
declare module "@mui/material/styles" {
    interface Theme {
        status: {
            danger: string;
        };
    }
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
    interface Palette {
        tertiary: Palette["primary"];
    }
    interface PaletteOptions {
        tertiary?: PaletteOptions["primary"];
    }
}

// Common theme properties that don't change between light/dark modes
const commonTheme: ThemeOptions = {
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: "2.5rem",
        },
        h2: {
            fontWeight: 600,
            fontSize: "2rem",
        },
        h3: {
            fontWeight: 600,
            fontSize: "1.75rem",
        },
        h4: {
            fontWeight: 600,
            fontSize: "1.5rem",
        },
        h5: {
            fontWeight: 500,
            fontSize: "1.25rem",
        },
        h6: {
            fontWeight: 500,
            fontSize: "1.1rem",
        },
        button: {
            textTransform: "none",
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    spacing: 8,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "8px 16px",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                },
            },
        },
    },
};

// Light theme
export const lightTheme = createTheme({
    ...commonTheme,
    palette: {
        mode: "light",
        primary: {
            main: "#3f51b5",
            light: "#6573c3",
            dark: "#2c387e",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#f50057",
            light: "#f73378",
            dark: "#ab003c",
            contrastText: "#ffffff",
        },
        tertiary: {
            main: "#4caf50",
            light: "#80e27e",
            dark: "#087f23",
            contrastText: "#ffffff",
        },
        background: {
            default: "#f8f9fa",
            paper: "#ffffff",
        },
        text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.6)",
        },
        divider: "rgba(0, 0, 0, 0.12)",
    },
    components: {
        ...commonTheme.components,
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff",
                    color: "rgba(0, 0, 0, 0.87)",
                },
            },
        },
    },
});

// Dark theme
export const darkTheme = createTheme({
    ...commonTheme,
    palette: {
        mode: "dark",
        primary: {
            main: "#7986cb",
            light: "#9fa8da",
            dark: "#3949ab",
            contrastText: "#000000",
        },
        secondary: {
            main: "#f48fb1",
            light: "#f8bbd0",
            dark: "#ec407a",
            contrastText: "#000000",
        },
        tertiary: {
            main: "#81c784",
            light: "#a5d6a7",
            dark: "#4caf50",
            contrastText: "#000000",
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#ffffff",
            secondary: "rgba(255, 255, 255, 0.7)",
        },
        divider: "rgba(255, 255, 255, 0.12)",
    },
    components: {
        ...commonTheme.components,
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#1e1e1e",
                    color: "#ffffff",
                },
            },
        },
    },
});

// Create theme based on mode
export const getTheme = (mode: PaletteMode) => {
    return mode === "light" ? lightTheme : darkTheme;
};

// Theme context for managing theme state
import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

interface ThemeContextType {
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    toggleTheme: () => { },
    isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        setIsDark(savedTheme ? savedTheme === "dark" : prefersDark);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ toggleTheme, isDark }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;