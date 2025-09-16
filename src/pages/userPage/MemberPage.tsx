import { Box, Button, Pagination, Stack } from "@mui/material";
import useResource from "../../hooks/useResource";
import GenericTable, { type GenericColumn } from "../../components/GenericTable";
import AddIcon from '@mui/icons-material/Add';
import FormCommon from "../common/FormCommon";
import { useState } from "react";

interface MemberFormValues {
    email: string;
    password: string;
    name: string;
}


const endpoints = {
    list: "/auth/member",
    item: "/auth/member",
    create: "/auth/member/register",
    update: "/auth/member",
    delete: "/auth/member",
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
        id: "updatedAt",
        label: "Updated At"
    },
    {
        id: "createdAt",
        label: "Created At"
    },
]

const MemberPage = () => {
    const [open, setOpen] = useState(false);
    const { list, isListLoading, deleteResource, createResource, setPage } = useResource("member", endpoints, { limit: 5 });
    if (isListLoading) {
        return <>Loading</>
    }


    const handleform = (
        values: MemberFormValues,
        formikHelpers: { resetForm: () => void }
    ) => {
        // console.log(values);
        createResource(values);
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
                "email": "",
                "password": "",
                "name": "",
            }} onSubmit={handleform} title="Add Member" />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Member</Button>
            </Box>
            <GenericTable
                data={(list as any)?.data?.map((d: any) => d.user as any)}
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
export default MemberPage;