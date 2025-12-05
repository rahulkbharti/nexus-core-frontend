import Stack from '@mui/material/Stack';
import NavbarBreadcrumbs from '../../components/NavbarBreadcrumbs';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useTheme as ThemeContext } from "../../theme/ThemeProvider";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
    toggleDrawer: (open: boolean) => () => void;
}

export default function Header({ toggleDrawer }: HeaderProps) {
    const { toggleTheme, isDark } = ThemeContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Stack
            direction="row"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                maxWidth: { sm: '100%', md: '1700px' },
                py: 1.5,
                px: 2,
            }}
            spacing={2}
        >
            {isMobile && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer(true)}
                    edge="start"
                >
                    <MenuIcon />
                </IconButton>
            )}
            <NavbarBreadcrumbs />
            <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <IconButton color="inherit" onClick={toggleTheme}>
                    {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </Stack>
        </Stack>
    );
}
