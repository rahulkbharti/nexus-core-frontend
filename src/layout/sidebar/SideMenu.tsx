// import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OptionsMenu from './OptionMenu';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
// import LibraryIcon from '@mui/icons-material/LibraryBooks';
// import NewMenu from '../../components/Test';
// import CardAlert from './CardAlert';
import { useSelector } from 'react-redux';
import { type AuthState } from '../../store/features/authSlice';


// import MenuItem from '../../components/Test';
import CardAlert from './CardAlert';


const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    backgroundColor: 'background.paper',
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
});

export default function SideMenu() {
    const userData = useSelector((state: { auth: AuthState }) => state.auth.loginData) ?? null;

    return (
        <Drawer
            variant="permanent"

            sx={{
                display: { md: 'block' },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Box sx={{ p: 2, mb: 1, display: "flex", alignItems: "center", gap: 1.5, alignContent: "center", justifyContent: "left", flexDirection: "row" }}>
                <img src="/NexusCore.png" alt="Nexus Icon" width={30} />
                {/* <img src="/NexusLogo.png" alt="Nexus Logo" width={100} /> */}
                {/* <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    <LibraryIcon />
                </Avatar> */}
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        Nexus Core
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        take it easy
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    mt: 'calc(var(--template-frame-height, 0px) + 3px)',
                    margin: "0 auto",
                    mb: 1
                }}
            >
                <SelectContent />
            </Box>
            <Divider />
            <Box
                sx={{
                    overflow: 'auto',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <MenuContent />
                <CardAlert />
                {/* <NewMenu /> */}
            </Box>

            <Stack
                direction="row"
                sx={{
                    p: 2,
                    gap: 1,
                    alignItems: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Avatar
                    sizes="small"
                    alt="Riley Carter"
                    src="/static/images/avatar/7.jpg"
                    sx={{ width: 36, height: 36 }}
                />
                <Box sx={{ mr: 'auto' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                        {userData && userData?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {userData && userData?.email}
                    </Typography>
                </Box>
                <OptionsMenu />
            </Stack>
        </Drawer>
    );
}
