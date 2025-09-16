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
import LibraryIcon from '@mui/icons-material/LibraryBooks';
import NewMenu from '../../components/Test';
import CardAlert from './CardAlert';

// import MenuItem from '../../components/Test';
// import CardAlert from './CardAlert';


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
            <Box sx={{ p: 2, mb: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    <LibraryIcon />
                </Avatar>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        Librarify
                    </Typography>
                    {/* CHANGED: Added Slogan/Subtitle */}
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Librarify pro Api
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                    p: 1.5,
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
                {/* <CardAlert /> */}
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
                        Riley Carter
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        riley@email.com
                    </Typography>
                </Box>
                <OptionsMenu />
            </Stack>
        </Drawer>
    );
}
