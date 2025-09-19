import React, { useState } from "react";
import {
    Box,
    TextField,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


const TableHeader = ({ children }: { children: React.ReactNode }) => {
    const [searchTerm, setSearchTerm] = useState("");
    // Uncomment and use if you want to control the select value
    // const [filterStatus, setFilterStatus] = useState("all");

    // const handleOpenFeeDialog = () => {
    //     // Implement dialog open logic here
    //     alert("Open Fee Dialog");
    // };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
                placeholder="Search fees..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
            />
            <Stack gap={2} direction={"row"}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={"all"}
                        label="Status"
                    // onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="borrowed">Borrowed</MenuItem>
                        <MenuItem value="reserved">Reserved</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                    </Select>
                </FormControl>
                {children}
            </Stack>
        </Box>
    )
}

export default TableHeader;