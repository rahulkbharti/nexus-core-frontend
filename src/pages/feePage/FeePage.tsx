import { Tab, Tabs, Typography } from "@mui/material"
import React from "react";
import FeesManagementSystem from "./FeeManagement";
import PaymentManagement from "./PaymentMangement";


const FeePage = () => {
    const [value, setValue] = React.useState(0);
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        const params = new URLSearchParams(window.location.search);
        if (newValue === 0) {
            params.delete("feeId");
        } else {
            params.set("feeId", "34");
        }
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
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
                sx={{ mb: 2 }}
            >
                <Tab label={<Typography fontWeight={500}><strong>Fees</strong></Typography>} />
                <Tab label={<Typography fontWeight={500}><strong>Payments</strong></Typography>} />
            </Tabs>
            {value === 0 ? <FeesManagementSystem /> : <PaymentManagement />}
        </>
    )
}
export default FeePage;