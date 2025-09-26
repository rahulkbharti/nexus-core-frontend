import { Box, Button, LinearProgress, Pagination, Stack } from "@mui/material";
import GenericTable, { type GenericColumn } from "../../components/GenericTable";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../apis/api";
import GenericForm from "../../components/GenericForm";
import FormInput from "../common/FormInput";

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
        id: 'isActive',
        label: "Account Status",
        renderCell: (value: any) => value ? "ACTIVE" : "INACTIVE"
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


const MemberPage = ({ key = "members" }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
    })
    const [filter, setFilter] = useState<filters>({ page: 1, limit: 3 });
    // For Fetching The List
    const { data: list, isLoading, isFetching } = useQuery({
        queryKey: [key, filter],
        queryFn: async ({ queryKey }) => {
            const [_, filter] = queryKey;
            // console.log("Fetching data with filter:", filter);
            const data = (await api.get("/auth/member", { params: { ...(typeof filter === "object" && filter !== null ? filter : {}) } }) as any).data;
            // console.log("list", data);
            return data;
        },
    })
    // For Mutating The Data (Create, Update, Delete)
    const { mutate: mutate } = useMutation({
        mutationFn: async ({ method, data, id }: { method: "POST" | "PUT" | "DELETE"; data?: any, id?: string | number }) => {
            // console.log("Mutating Data ", method, data);
            if (method === "POST") {
                const _data = await api.post("/auth/member/register", data);
                return _data.data;
            } else if (method === "PUT") {
                const _data = await api.put("/auth/member/" + id, data);
                return _data.data;
            } else if (method === "DELETE") {
                const _data = await api.delete("/auth/member/" + id);
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
        console.log("Submitting Form", info);
        if (id) {
            mutate(info);
        } else {
            mutate(info);
        }
        setOpen(false);
        setForm({ name: "", email: "" });
        setId(null);
    }
    // Handle Edit, Delete, View Actions
    const handleActions = (method: "EDIT" | "DELETE" | "VIEW", values: { [key: string]: any }, id: number) => {
        if (method === "EDIT") {
            setForm({
                name: values.name ?? "",
                email: values.email ?? "",
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
            });
            setId(id);
            setOpen(true);
        }
    }
    console.log(list)
    return (
        <Box>
            <GenericForm open={open} setOpen={setOpen} initialValue={form} onSubmit={handleSubmit} id={id}>
                <FormInput name="name" label="Name" type="text" required />
                <FormInput name="email" label="Email" type="email" required />
            </GenericForm>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setOpen(true); setForm({ name: "", email: "" }); setId(null); }}>Add Member</Button>
            </Box>
            {(isLoading || isFetching) && <LinearProgress sx={{ mb: 1 }} />}

            <GenericTable
                data={(list as any)?.data?.map((d: any) => d.user as any)}
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
export default MemberPage;