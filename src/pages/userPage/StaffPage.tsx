import { Box, Button, FormControl, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import GenericTable, { type GenericColumn } from "../../components/GenericTable";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../apis/api";
import GenericForm from "../../components/GenericForm";
import FormInput from "../common/FormInput";
import FormOption from "../common/FormOption";
import StaffPermissions from "./StaffPermissions";

const padStart = (value: any) => value?.toString().padStart(3, "0");
const columns: GenericColumn[] = [
    {
        id: 'id',
        label: 'USER ID',
        renderCell: padStart
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
        label: "Updated At",
        renderCell: (value: any) => new Date(value).toLocaleString()
    },
    {
        id: "createdAt",
        label: "Created At",
        renderCell: (value: any) => new Date(value).toLocaleString()
    },
]

type filters = {
    page?: number;
    limit?: number;
    search?: string;
    [key: string]: any;
}

const StaffPage = ({ key = "members" }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        roleId: 0,

    })
    const [filter, setFilter] = useState<filters>({ page: 1, limit: 3, role: 0 });
    // For Fetching The List
    const { data: list } = useQuery({
        queryKey: [key, filter],
        queryFn: async ({ queryKey }) => {
            const [_, filter] = queryKey;
            // console.log("Fetching data with filter:", filter);
            const data = (await api.get("/auth/staff", { params: { ...(typeof filter === "object" && filter !== null ? filter : {}) } }) as any).data;
            // console.log("list", data);
            return data;
        },
    })
    // Getting Role
    const { data: roles } = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const data = (await api.get("/auth/role") as any).data;
            return data;
        },
        staleTime: Infinity
    })
    // For Mutating The Data (Create, Update, Delete)
    const { mutate: mutate } = useMutation({
        mutationFn: async ({ method, data, id }: { method: "POST" | "PUT" | "DELETE"; data?: any, id?: string | number }) => {
            // console.log("Mutating Data ", method, data);
            if (method === "POST") {
                const _data = await api.post("/auth/staff/register", data);
                return _data.data;
            } else if (method === "PUT") {
                const _data = await api.put("/auth/staff/" + id, data);
                return _data.data;
            } else if (method === "DELETE") {
                const _data = await api.delete("/auth/staff/" + id);
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
            mutate(info);
        } else {
            mutate(info);
        }
        setOpen(false);
        setForm({ name: "", email: "", password: "", roleId: 0 });
        setId(null);
    }
    // Handle Edit, Delete, View Actions
    const handleActions = (method: "EDIT" | "DELETE" | "VIEW", values: { [key: string]: any }, id: number) => {
        console.log("Actionsss", method, values, id);

        if (method === "EDIT") {
            setForm({
                name: values.name ?? "",
                email: values.email ?? "",
                password: values.password ?? "",
                roleId: values.roleId ?? 0
            });
            setId(id);
            setOpen(true);
        } else if (method === "DELETE") {
            setFilter({ ...filter, page: 1 });
            mutate({ method: "DELETE", id });
        } else if (method === "VIEW") {
            setForm({
                name: values.name ?? "",
                email: values.email ?? "",
                password: values.password ?? "",
                roleId: values.roleId ?? 0
            });
            setId(id);
            setOpen(true);
        }
    }

    console.log(list)
    return (
        <Box>
            <GenericForm open={open} setOpen={setOpen} initialValue={form} onSubmit={handleSubmit} id={id}>
                <Stack direction={"row"} gap={2}>
                    <FormInput name="name" label="Name" type="text" required />
                    <FormInput name="email" label="Email" type="email" required />
                </Stack>
                {(!id) && (<FormInput name="password" label="Password" type="password" required={id ? false : true} />)}
                <FormOption name="roleId" label="Role" required>
                    {(roles?.data || []).map((role: any) => (
                        <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                    ))}
                </FormOption>
                <Typography sx={{ mb: 2 }}>Staff Permissions :</Typography>
                <StaffPermissions permissions={[]} setPermissions={() => { }} />
            </GenericForm>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={filter.role}
                        label="Role"
                        onChange={(e) => { setFilter({ ...filter, role: e.target.value, page: 1 }) }}
                    >
                        <MenuItem value={0}>All Role</MenuItem>
                        {(roles?.data || []).map((role: any) => (
                            <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setOpen(true); setForm({ name: "", email: "", password: "", roleId: 0 }); setId(null); }}>Add Staff</Button>
            </Box>
            <GenericTable
                data={(list as any)?.data?.map((d: any) => {
                    return { ...d.user, roleId: d.roleId }
                })}
                columns={columns}
                keyField="id"
                handleSort={() => { }}
                handleEdit={handleActions}
            />
            {(list as any)?.pages > 1 && (
                <Stack sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Pagination
                        count={(list as any).pages}
                        // page={filter.page}
                        showFirstButton
                        showLastButton
                        onChange={(_e, page) => { setFilter({ ...filter, page }) }}
                    />
                </Stack>
            )}
        </Box>
    )
}
export default StaffPage;