import { Tab, Tabs, Typography } from "@mui/material"
import React from "react";
import MemberPage from "./MemberPage";
import StaffPage from "./StaffPage";

const UserPage = () => {
    const [value, setValue] = React.useState(0);
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }
    return (
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
            >
                <Tab label={<Typography fontWeight={500}><strong>Members</strong></Typography>} />
                <Tab label={<Typography fontWeight={500}><strong>Staffs</strong></Typography>} />
            </Tabs>
            {value === 0 ? <MemberPage /> : <StaffPage />}
        </>
    )
}
export default UserPage;