import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GenericColumn } from "../../components/GenericTable";
import api from "../../apis/api";
import { useState } from "react";
import GenericTable from "../../components/GenericTable";
import { Box, Button, MenuItem, Pagination, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import FormInput from "../common/FormInput";
import GenericForm from "../../components/GenericForm";
import FormOption from "../common/FormOption";
// import { useParams } from "react-router-dom";


const padStart = (value: any) => value?.toString().padStart(3, "0");
const columns: GenericColumn[] = [
    {
        id: 'id',
        label: 'ID',
        renderCell: padStart
    }, {
        id: 'barcode',
        label: 'Barcode',
    },
    {
        id: 'location',
        label: 'Location',
    },
    {
        id: "condition",
        label: "Condition"
    }, {
        id: "status",
        label: "Status",
    }
]
const BookCopy = ({ key = "copies", bookId = 0 }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        barcode: "89273",
        status: "AVAILABLE",
        dateAcquired: "2002-10-13",
        location: "Main Shelf, Section B",
        condition: "Good"
    });
    const [filter, setFilter] = useState<{ [key: string]: any }>({ page: 1, limit: 4 });
    const [id, setId] = useState<number | null>(null);
    // console.log(bookId, key);
    const { data: list } = useQuery({
        queryKey: [key, filter, bookId],
        queryFn: async ({ queryKey }) => {
            const [_, filter, bookId] = queryKey;
            try {
                console.log("Filter value:", filter);
                const responce = await api.get(`/books/${bookId}/copies`, { params: { ...(typeof filter === "object" && filter !== null ? filter : {}) } });
                if (responce.status === 200) {
                    return responce.data;
                }
            } catch (e) {
                console.log(e)
            }
            return []
        }
    })
    const { mutate: mutate } = useMutation({
        mutationFn: async ({ method, data, id }: { method: "POST" | "PUT" | "DELETE"; data?: any, id?: string | number }) => {
            // console.log("Mutating Data ", method, data);
            // return;
            if (method === "POST") {
                const _data = await api.post(`/books/${bookId}/copies`, data);
                return _data.data;
            } else if (method === "PUT") {
                const _data = await api.put(`/books/${bookId}/copies/${id}`, data);
                return _data.data;
            } else if (method === "DELETE") {
                const _data = await api.delete(`/books/${bookId}/copies/${id}`);
                return _data.data;
            }
            return { message: "provide an appropriate method" };
        },
        onSuccess: (_data) => {
            // console.log("Mutated Data", data)
            queryClient.invalidateQueries({ queryKey: [key] });
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: (e) => {
            console.log(e)
        }

    })
    const handleActions = (method: "EDIT" | "DELETE" | "VIEW", values: { [key: string]: any }, id: number) => {
        // console.log("Handling Action:", method, values, id);
        if (method === "EDIT") {
            setId(id);
            setForm({
                barcode: values.barcode ?? "",
                status: values.status ?? "",
                dateAcquired: values.dateAcquired ?? "2002-10-13",
                location: values.location ?? "",
                condition: values.condition ?? ""
            });
            setOpen(true);
        } else if (method === "DELETE") {
            mutate({ method: "DELETE", id });
            setFilter({ ...filter, page: 1 });
        } else if (method === "VIEW") {

        }
    }
    const handleSubmit = (data: any) => {
        console.log("Submitting Data", data);
        if (id) {
            mutate(data);
        } else {
            mutate(data);
        }
    }
    console.log(list, bookId)
    return (
        <>
            <GenericForm open={open} id={id} setOpen={setOpen} initialValue={form} onSubmit={handleSubmit}>
                <FormInput name="barcode" label="Barcode" required />
                <FormOption name="status" label="Status" required>
                    <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
                    <MenuItem value="ON_LOAN">ON_LOAN</MenuItem>
                    <MenuItem value="DAMAGED">DAMAGED</MenuItem>
                    <MenuItem value="LOST">LOST</MenuItem>
                </FormOption>
                <FormInput name="dateAcquired" label="Date Acquired" type="date" required />
                <FormInput name="location" label="Location" required />
                <FormInput name="condition" label="Condition" required />
            </GenericForm>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setOpen(true); setForm({ barcode: "", location: "", condition: "", status: "", dateAcquired: "2002-10-13" }); setId(null); }}>Add Book Copy</Button>
            </Box>
            <GenericTable data={(list as any)?.data || []} columns={columns} key={key} handleEdit={handleActions} handleSort={() => { }} keyField="id" />
            {(list as any)?.pagination?.totalPages > 1 && (
                <Stack sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Pagination count={(list as any)?.pagination.totalPages} showFirstButton showLastButton onChange={(_e, page) => { setFilter({ ...filter, page }) }} />
                </Stack>
            )}
        </>
    )
}
export default BookCopy;