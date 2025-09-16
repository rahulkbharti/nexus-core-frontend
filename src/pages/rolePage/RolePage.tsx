import { Box, Button, LinearProgress, Pagination, Stack } from "@mui/material";
import useResource from "../../hooks/useResource";
import GenericTable, { type GenericColumn } from "../../components/GenericTable";
import AddIcon from '@mui/icons-material/Add';
import FormCommon from "../common/FormCommon";
import { useState } from "react";
import { useFetchData } from "../../hooks/useApi";

const endpoints = {
    list: "/auth/role",
    item: "/auth/role",
    create: "/auth/role/create",
    update: "/auth/role",
    delete: "/auth/role",
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
        id: "permissions",
        label: "Permissions",
        renderCell: (value: string[]) => {
            if (!value || value.length === 0) {
                return "No Permission Assigned";
            }
            return value.map(v => (v as any).name.slice(0, 15)).join(", ");
        }
    }
]

const RolePage = () => {
    const [open, setOpen] = useState(false);
    const { list, isListLoading, createResource, deleteResource, setPage } = useResource("role", endpoints, { limit: 5 });
    // if (isListLoading) {
    //     return <>Loading</>
    // }
    interface MemberFormValues {
        email: string;
        password: string;
        name: string;
    }
    const { data: roles } = useFetchData("roles-get", "/auth/role", {});
    console.log(roles);


    const handleform = async (
        values: MemberFormValues,
        formikHelpers: { resetForm: () => void }
    ) => {
        // console.log(values);
        await createResource(values);
        formikHelpers.resetForm();
        setOpen(false);
    }
    const handleActions = async (action: string, row: any) => {
        if (action === "DELETE") {
            deleteResource(row.id)
        }
    }

    return (
        <Box>
            <FormCommon open={open} setOpen={setOpen} initialValues={{
                "name": "",
            }} onSubmit={handleform} title="Add Member" />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Role</Button>
            </Box>
            {isListLoading && <LinearProgress />}
            <GenericTable
                data={(list as any)?.data}
                columns={columns}
                keyField="id"
                handleSort={() => { }}
                handleEdit={handleActions}
            />
            {(list as any)?.pages > 1 && (
                <Stack sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Pagination count={(list as any).pages} showFirstButton showLastButton onChange={(_e, page) => setPage(page)} />
                </Stack>
            )}
        </Box>
    )
}
export default RolePage;