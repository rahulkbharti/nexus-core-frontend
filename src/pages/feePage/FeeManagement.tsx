import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import api from '../../apis/api';
import GenericTable, { type GenericColumn } from '../../components/GenericTable';
import { IconButton, LinearProgress, Pagination, Stack } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import GenericForm from '../../components/GenericForm';
import FormInput from '../common/FormInput';
import { showNotification } from '../../utils/notification';




const FeesManagementSystem: React.FC = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [form, _setForm] = useState({
        feeId: 0,
        amount: 0,
        method: "CASH"
    });
    const [filter, setFilter] = useState({});
    // Geting Fee Data
    const { data: list, isFetching, isLoading } = useQuery({
        queryKey: ['fees', filter],
        queryFn: async ({ queryKey }) => {
            const [_, filter] = queryKey;
            const data = (await api.get("/fees", { params: { ...(typeof filter === "object" && filter !== null ? filter : {}) } }) as any).data;
            return data;
        }
    })
    // handle Peyments 
    const { mutate: Pay } = useMutation({
        mutationFn: async ({ data, id }: { method: "POST" | "PUT" | "DELETE"; data?: any, id?: string | number }) => {
            data.feeId = id;
            data.amount = Number(data.amount)
            console.log(data)
            try {
                const responce = await api.post("/fees/payments", data);
                if (responce.status === 201) {
                    console.log(responce)
                    return responce.data;
                } else {
                    throw Error("Somthing Worng")
                }
            } catch (e) {
                console.error(e);
                showNotification("Somthing went wrong", 'error');
            }
        },
        onSuccess: () => {
            showNotification("Successfully Done", "success")
            queryClient.invalidateQueries({ queryKey: ["fees"] })
        }
    })



    const columns: GenericColumn[] = [
        { id: "id", label: "FeeID" },
        {
            id: "member", label: "Name", renderCell: (value: any, row: any) => value?.user?.name + " (" + row?.memberId + ")"
        }, {
            id: "type", label: "Type"
        }, {
            id: "status", label: "Status"
        },
        {
            id: "amount", label: "Amount", renderCell: (value: number) => value + " Rs"
        },
        {
            id: "balance", label: "Balance", renderCell: (value: number) => value + " Rs"
        },
        {
            id: "dueDate", label: "Due Date", renderCell: (value: string) => new Date(value).toLocaleDateString()
        },
        {
            id: "actions", label: "Actions", renderCell: (_value: any, row: any) => {
                return (
                    <>
                        <IconButton color="primary" onClick={() => { setId(row?.id); setOpen(true); }} disabled={row.balance >= row.amount}><PaymentIcon /></IconButton>
                    </>
                )
            }
        }
    ]
    // console.log(list)
    return (
        <>
            <GenericForm open={open} setOpen={setOpen} id={id} initialValue={form} onSubmit={Pay}>
                <FormInput name="amount" label='Amount' />
                <FormInput name="method" label='Method' />
            </GenericForm>
            {(isLoading || isFetching) && <LinearProgress sx={{ mb: 1 }} />}
            <GenericTable columns={columns} data={(list?.fees || [])} handleEdit={() => { }} handleSort={() => { }} keyField='id' actions={false} />
            {(list as any)?.fees > 1 && (
                <Stack sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Pagination count={(list as any).fees} showFirstButton showLastButton onChange={(_e, page) => { setFilter({ ...filter, page }) }} />
                </Stack>
            )}
        </>
    )
}

export default FeesManagementSystem;