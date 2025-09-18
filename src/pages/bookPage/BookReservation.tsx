import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GenericColumn } from "../../components/GenericTable";
import api from "../../apis/api";
import { useState } from "react";
import GenericTable from "../../components/GenericTable";
import { Box, Button, Pagination, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import FormInput from "../common/FormInput";
import GenericForm from "../../components/GenericForm";


const padStart = (value: any) => value?.toString().padStart(3, "0");
const columns: GenericColumn[] = [
    {
        id: 'ISBN',
        label: 'ISBN',
        renderCell: padStart
    }, {
        id: 'title',
        label: 'Title',
    },
    {
        id: 'author',
        label: 'Author',
    },
    {
        id: 'publisher',
        label: 'Publisher',
    }, {
        id: "genre",
        label: "Genre"
    }, {
        id: "publicationDate",
        label: "Publication Date",
        renderCell: (value) => new Date(value).toLocaleDateString()
    }
]
const BookReservation = ({ key = "books" }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [form, setForm] = useState({
        title: "",
        author: "",
        publisher: "",
        genre: "",
        publicationDate: "",
        ISBN: ""
    });
    const [filter, setFilter] = useState<{ [key: string]: any }>({ page: 1, limit: 4 });

    const { data: list } = useQuery({
        queryKey: [key, filter],
        queryFn: async ({ queryKey }) => {
            const [_, filter] = queryKey;
            // console.log("Fetching data with filter:", filter);
            const data = (await api.get("/books", { params: { ...(typeof filter === "object" && filter !== null ? filter : {}) } }) as any).data;
            // console.log("list", data);
            return data;
        }
    });
    const { mutate: mutate } = useMutation({
        mutationFn: async ({ method, data, id }: { method: "POST" | "PUT" | "DELETE"; data?: any, id?: string | number }) => {
            // console.log("Mutating Data ", method, data);
            if (method === "POST") {
                const _data = await api.post("/books", data);
                return _data.data;
            } else if (method === "PUT") {
                const _data = await api.put("/books/" + id, data);
                return _data.data;
            } else if (method === "DELETE") {
                const _data = await api.delete("/books/" + id);
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
    const handleActions = (method: "EDIT" | "DELETE" | "VIEW", values: { [key: string]: any }, id: number) => {
        console.log("Handling Action:", method, values, id);
        if (method === "EDIT") {
            setForm({
                title: values.title ?? "",
                author: values.author ?? "",
                publisher: values.publisher ?? "",
                genre: values.genre ?? "",
                publicationDate: values.publicationDate ?? "",
                ISBN: values.ISBN ?? ""
            });
            setId(id);
            setOpen(true);
        } else if (method === "DELETE") {
            mutate({ method: "DELETE", id });
            setFilter({ ...filter, page: 1 });
        } else if (method === "VIEW") {
            setForm({
                title: values.title ?? "",
                author: values.author ?? "",
                publisher: values.publisher ?? "",
                genre: values.genre ?? "",
                publicationDate: values.publicationDate ?? "",
                ISBN: values.ISBN ?? ""
            });
            setId(id);
            setOpen(true);
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
    // console.log("list", list);
    return (
        <>
            <GenericForm open={open} setOpen={setOpen} initialValue={form} onSubmit={handleSubmit} id={id}>
                <FormInput name="ISBN" label="ISBN" type="text" required />
                <FormInput name="title" label="Title" type="text" required />
                <FormInput name="author" label="Author" type="text" required />
                <FormInput name="publisher" label="Publisher" type="text" required />
                <FormInput name="genre" label="Genre" type="text" required />
                <FormInput name="publicationDate" label="Publication Date" type="date" required />
            </GenericForm>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setOpen(true); setForm({ title: "324", author: "234", publisher: "2342", genre: "23423", publicationDate: "", ISBN: "" }); setId(null); }}>Add Book</Button>
            </Box>
            <GenericTable data={list?.books || []} columns={columns} handleSort={() => { }} handleEdit={handleActions} keyField="sn" />
            {(list as any)?.totalPages > 1 && (
                <Stack sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Pagination count={(list as any).totalPages} showFirstButton showLastButton onChange={(_e, page) => { setFilter({ ...filter, page }) }} />
                </Stack>
            )}
        </>
    )
}

export default BookReservation;