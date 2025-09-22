import { useQuery } from "@tanstack/react-query";
import GenericTable, { type GenericColumn } from "../../components/GenericTable";
import { useState } from "react";
import api from "../../apis/api";
import { Pagination, Stack } from "@mui/material";

const columns: GenericColumn[] = [
    { id: "id", label: "Payment ID" },
    { id: "memberId", label: "Member ID" },
    { id: "amount", label: "Amount", renderCell: (value: number) => value + " Rs" },
    { id: "method", label: "Method" },
    { id: "status", label: "Status" },
    { id: "paymentDate", label: "Payment Date", renderCell: (value: string) => new Date(value).toLocaleDateString() },
]
type PaymentManagementProps = {
    feeId?: number;
    memberId?: number
};

const PaymentManagement: React.FC<PaymentManagementProps> = ({ feeId = 0, memberId = 0 }) => {
    console.log("Payments", feeId, memberId)
    const [filter, setFilter] = useState({ page: 1, limit: 4 });
    const { data: list } = useQuery({
        queryKey: ['payments'],
        queryFn: async ({ queryKey }) => {
            console.log(queryKey)
            try {
                const responce = await api.get("/fees/payments");
                console.log(responce);
                return responce.data;
            }
            catch (e) {
                console.log(e)
            }
            return []
        }
    })
    console.log(list)
    return (
        <>
            <GenericTable data={((list as any)?.payments || [])} columns={columns} handleEdit={() => { }} handleSort={() => { }} keyField="id" actions={false} />
            {(list as any)?.payments > 1 && (
                <Stack sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Pagination count={(list as any).payments} showFirstButton showLastButton onChange={(_e, page) => { setFilter({ ...filter, page }) }} />
                </Stack>
            )}
        </>
    )
}
export default PaymentManagement;