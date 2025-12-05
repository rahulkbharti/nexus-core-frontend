import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import SideMenu from "./sidebar/SideMenu";
import Header from "./header/Header";
import { useState } from "react";
import SideMenuMobile from "../components/SideMenuMobile";

const Layout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    return (
        <Stack direction={"row"}>
            {!isMobile && <SideMenu />}
            <SideMenuMobile open={isDrawerOpen} toggleDrawer={toggleDrawer} />
            <Box sx={{ flexGrow: 1, width: isMobile ? '100%' : "calc(100% - 240px)" }}>
                <Header toggleDrawer={toggleDrawer} />
                <Box p={2}>
                    <Outlet />
                </Box>
            </Box>
        </Stack>
    )
};
export default Layout;
