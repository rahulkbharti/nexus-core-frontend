import { Box, Button, FormControl, InputLabel, MenuItem, Pagination, Select, Stack } from "@mui/material";
import useResource from "../../hooks/useResource";
import GenericTable, { type GenericColumn } from "../../components/GenericTable";
import AddIcon from '@mui/icons-material/Add';
import FormCommon from "../common/FormCommon";
import { useEffect, useState } from "react";
import { useFetchData } from "../../hooks/useApi";
import api from "../../apis/api";

const endpoints = {
    list: "/auth/staff",
    item: "/auth/staff",
    create: "/auth/staff/register",
    update: "/auth/staff",
    delete: "/auth/staff",
}

const columns: GenericColumn[] = [
    {
        id: 'id',
        label: 'USER ID'
    },
    {
        id: "name",
        label: "Name"
    },
    {
        id: "email",
        label: "Email"
    },
    {
        id: "role",
        label: "Role"
    },
    {
        id: "updatedAt",
        label: "Updated At"
    },
    {
        id: "createdAt",
        label: "Created At"
    }
]

const StaffPage = () => {
    const [open, setOpen] = useState(false);
    const [roles, seteRoles] = useState<any[]>([]);
    const { list, isListLoading, createResource, setPage } = useResource("staff", endpoints, { limit: 5, role: "all" });
    if (isListLoading) {
        return <>Loading</>
    }
    const handleform = (
        values: { email: string; password: string; name: string; roleId: number },
        formikHelpers: { resetForm: () => void }
    ) => {
        // console.log(values);
        createResource(values);
        formikHelpers.resetForm();
        setOpen(false);
    }
    useEffect(() => {
        api.get("/auth/role").then(e => seteRoles(e.data.data))
    }, [])

    return (
        <Box>
            <FormCommon open={open} setOpen={setOpen} initialValues={{
                "email": "",
                "password": "",
                "name": "",
                "roleId": 8
            }} onSubmit={handleform} title="Add Member" />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        // value={filters.role}
                        label="Role"
                    // onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                    >
                        <MenuItem value="all">All Role</MenuItem>
                        {(roles as any)?.map((role: any) => (
                            <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Staff</Button>
            </Box>
            <GenericTable
                data={(list as any)?.data?.map((d: any) => { const s = d.user as any; d.user.role = d.role.name; return s })}
                columns={columns}
                keyField="id"
                handleSort={() => { }}
                handleEdit={(action: string, row: any) => { console.log(action, row) }}
            />
            {(list as any)?.pages > 1 && (
                <Stack sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Pagination count={(list as any).pages} showFirstButton showLastButton onChange={(_e, page) => setPage(page)} />
                </Stack>
            )}
        </Box>
    )
}
export default StaffPage;