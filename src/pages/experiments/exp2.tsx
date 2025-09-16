import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";
import api from "../../apis/api";
// import axios from "axios";


type filters = {
    page?: number;
    limit?: number;
    search?: string;
    [key: string]: any;
}

const LearningRQ = ({ key = "posts" }: { key: string }) => {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<filters>({ page: 1, limit: 1 });
    const { data: list } = useQuery({
        queryKey: [key, filter],
        queryFn: async ({ queryKey }) => {
            const [_, filter] = queryKey;
            console.log("Fetching data with filter:", filter);
            const data = (await api.get("/auth/role", { params: { ...(typeof filter === "object" && filter !== null ? filter : {}) } }) as any).data;
            console.log("list", data);
            return data;
        },
    })

    const { mutate: mutate } = useMutation({
        mutationFn: async ({ method, data, id }: { method: "POST" | "PUT" | "DELETE"; data: any, id?: string | number }) => {
            console.log("Mutating Data ", method, data);
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
        onSuccess: (data) => {
            console.log("Mutated Data", data)
            queryClient.invalidateQueries({ queryKey: [key] })
        },
        onError: (e) => {
            console.log(e)
        }

    })

    return <div>Learning React Query
        <pre>{JSON.stringify(list, null, 2)}</pre>
        <button onClick={() => setFilter({ page: 2, limit: 1 })}>Set Filter to page: 2</button>
        <button onClick={() => setFilter({ page: 1, limit: 1 })}>Reset Filter</button>
        <button onClick={() => { mutate({ method: "DELETE", data: { name: "new Role" }, id: 29 }) }}>Mutate</button>
    </div>
}
export default LearningRQ