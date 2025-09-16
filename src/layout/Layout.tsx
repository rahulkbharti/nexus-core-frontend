import { Box, Stack } from "@mui/material";

import { Outlet } from "react-router-dom";
import SideMenu from "./sidebar/SideMenu";
import Header from "./header/Header";

const Layout = () => {
    return (
        <Stack direction={"row"}>
            <SideMenu />
            <Box sx={{ flexGrow: 1, width: "calc(100% - 240px)" }}>
                <Header />
                <Box p={2}>
                    <Outlet />
                </Box>
            </Box>
        </Stack>
    )
};
export default Layout;
