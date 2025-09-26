import { Box, Button, LinearProgress, Pagination, Stack, Typography } from "@mui/material";
import GenericTable, { type GenericColumn } from "../../components/GenericTable";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../apis/api";
import GenericForm from "../../components/GenericForm";
import FormInput from "../common/FormInput";
import RolePermissions from "./RolePermissions";


type Permission = { id: number; name: string; desc: string };

const padStart = (value: any) => value?.toString().padStart(3, "0");

const columns: GenericColumn[] = [
    {
        id: 'id',
        label: 'Role ID',
        renderCell: padStart
    },
    {
        id: "name",
        label: "Role Name"
    },
    {
        id: "permissions",
        label: "Permissions",
        renderCell: (value: any) => {
            if (Array.isArray(value)) {
                if (value.length === 0) return "No Permissions";
                return value.map((v: any) => v.name).join(", ")
            }
            return "No Permissions";
        }
    }
];


type filters = {
    page?: number;
    limit?: number;
    search?: string;
    [key: string]: any;
}

type Form = {
    name: string;
    permissions: Permission[];
}

const RolePage = ({ key = "roles" }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [form, setForm] = useState<Form>({
        name: "",
        permissions: [],
    })
    const [filter, setFilter] = useState<filters>({ page: 1, limit: 3 });
    // For Fetching The List
    const { data: list, isLoading, isFetching } = useQuery({
        queryKey: [key, filter],
        queryFn: async ({ queryKey }) => {
            const [_, filter] = queryKey;
            // console.log("Fetching data with filter:", filter);
            const data = (await api.get("/auth/role", { params: { ...(typeof filter === "object" && filter !== null ? filter : {}) } }) as any).data;
            // console.log("list", data);
            return data;
        },
    })
    // For Mutating The Data (Create, Update, Delete)
    const { mutate: mutate } = useMutation({
        mutationFn: async ({ method, data, id }: { method: "POST" | "PUT" | "DELETE"; data?: any, id?: string | number }) => {
            console.log("Mutating Data ", method, data);
            // return;
            if (method === "POST") {
                const _data = await api.post("/auth/role/create", data);
                return _data.data;
            } else if (method === "PUT") {
                const _data = await api.put("/auth/role/" + id, data);
                return _data.data;
            } else if (method === "DELETE") {
                const _data = await api.delete("/auth/role/" + id);
                return _data.data;
            }
            return { message: "provide an appropriate method" };
        },
        onSuccess: (_data) => {
            // console.log("Mutated Data", data)
            queryClient.invalidateQueries({ queryKey: [key] })
        },
        onError: (e) => {
            console.log(e)
        }

    })

    // Handle Submut of the Form
    const handleSubmit = (info: any) => {
        // console.log("Submitting Form", info);
        if (id) {
            mutate({
                method: "PUT",
                data: { ...info.data, permissions: form.permissions },
                id: info.id,
            });
        } else {
            mutate({
                method: "POST",
                data: { ...info.data, permissions: form.permissions },
                id: info.id,
            });
        }
        setOpen(false);
        setForm({ name: "", permissions: [] });
        setId(null);
    }
    // Handle Edit, Delete, View Actions
    const handleActions = (method: "EDIT" | "DELETE" | "VIEW", values: { [key: string]: any }, id: number) => {
        if (method === "EDIT") {
            setForm({
                name: values.name ?? "",
                permissions: values.permissions ?? [],
            });
            setId(id);
            setOpen(true);
        } else if (method === "DELETE") {
            setFilter({ ...filter, page: 1 });
            mutate({ method: "DELETE", id });
        } else if (method === "VIEW") {
            setForm({
                name: values.name ?? "",
                permissions: values.permissions ?? [],
            });
            setId(id);
            setOpen(true);
        }
    }
    // console.log(form.permissions)
    return (
        <Box>

            <GenericForm open={open} setOpen={setOpen} initialValue={form} onSubmit={handleSubmit} id={id}>
                <FormInput name="name" label="Name" type="text" required />
                <Typography sx={{ my: 2 }}>Role Permissions :</Typography>
                <RolePermissions permissions={form.permissions} setPermissions={(permissions) => setForm({ ...form, permissions })} />
            </GenericForm>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setOpen(true); setForm({ name: "", permissions: [] }); setId(null); }}>Add Role</Button>
            </Box>
            {(isLoading || isFetching) && <LinearProgress sx={{ mb: 1 }} />}
            <GenericTable
                data={(list as any)?.data}
                columns={columns}
                keyField="id"
                handleSort={() => { }}
                handleEdit={handleActions}
            />
            {(list as any)?.pages > 1 && (
                <Stack sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Pagination count={(list as any).pages} showFirstButton showLastButton onChange={(_e, page) => { setFilter({ ...filter, page }) }} />
                </Stack>
            )}
        </Box>
    )
}
export default RolePage;