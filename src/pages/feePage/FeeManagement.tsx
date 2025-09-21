import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import api from '../../apis/api';
import GenericTable, { type GenericColumn } from '../../components/GenericTable';
import { LinearProgress, Pagination, Stack } from '@mui/material';
// import PaymentIcon from '@mui/icons-material/Payment';

const columns: GenericColumn[] = [
    { id: "id", label: "FeeID" },
    {
        id: "member", label: "Name", renderCell: (value: any) => value?.user?.name
    }, {
        id: "type", label: "Type"
    }, {
        id: "status", label: "Status"
    },
    {
        id: "amount", label: "Amount"
    }, {
        id: "balance", label: "Balance"
    }
]


const FeesManagementSystem: React.FC = () => {
    const [filter, setFilter] = useState({});
    const { data: list, isFetching, isLoading } = useQuery({
        queryKey: ['fees', filter],
        queryFn: async ({ queryKey }) => {
            const [_, filter] = queryKey;
            const data = (await api.get("/fees", { params: { ...(typeof filter === "object" && filter !== null ? filter : {}) } }) as any).data;
            return data;
        }
    })
    console.log(list)
    return (
        <>
            {(isLoading || isFetching) && <LinearProgress sx={{ mb: 1 }} />}
            <GenericTable columns={columns} data={(list?.fees || [])} handleEdit={() => { }} handleSort={() => { }} keyField='id' />
            {(list as any)?.fees > 1 && (
                <Stack sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Pagination count={(list as any).fees} showFirstButton showLastButton onChange={(_e, page) => { setFilter({ ...filter, page }) }} />
                </Stack>
            )}
        </>
    )
}

export default FeesManagementSystem;