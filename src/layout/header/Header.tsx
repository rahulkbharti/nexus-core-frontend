import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from '../../components/MenuButton';
import NavbarBreadcrumbs from '../../components/NavbarBreadcrumbs';
// import Search from '../../components/Search';
import { IconButton } from '@mui/material';
import { useTheme as ThemeContext } from "../../theme/ThemeProvider";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function Header() {
    const { toggleTheme, isDark } = ThemeContext();
    return (
        <Stack
            direction="row"
            sx={{
                display: { md: 'flex' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                maxWidth: { sm: '100%', md: '1700px' },
                py: 1.5,
                px: 2,
            }}
            spacing={2}
        >
            <NavbarBreadcrumbs />
            <Stack direction="row" sx={{ gap: 1 }}>
                {/* <Search /> */}
                {/* <CustomDatePicker /> */}
                <MenuButton showBadge aria-label="Open notifications">
                    <NotificationsRoundedIcon />
                </MenuButton>
                <IconButton color="inherit" onClick={toggleTheme}>
                    {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </Stack>
        </Stack>
    );
}
