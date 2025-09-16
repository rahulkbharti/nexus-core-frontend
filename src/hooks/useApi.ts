// src/hooks/useApi.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../apis/api";

// GET - Fetch data
export const useFetchData = (
  key: string,
  endpoint: string,
  queryParams?: any,
  options: Record<string, unknown> = {}
) => {
  return useQuery({
    // IMPORTANT: keep key as an array [key, params]
    queryKey: [key, queryParams],
    queryFn: async () => {
      const response = await api.get(endpoint, {
        params: queryParams,
      });
      return response.data;
    },
    ...options,
  });
};

// POST - Create data
export const useCreateData = (
  listKey: string, // pass the listKey here (e.g. "roleList")
  endpoint: string,
  options: Record<string, unknown> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post(endpoint, data);
      return response.data;
    },
    onSuccess: () => {
      // invalidate the list key so React Query refetches it
      queryClient.invalidateQueries({ queryKey: [listKey] });
    },
    ...options,
  });
};

// PUT/PATCH - Update data
type UpdateArgs = { id: string | number; data: any };

export const useUpdateData = (
  listKey: string,
  endpoint: string,
  options: Record<string, unknown> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateArgs) => {
      const response = await api.put(`${endpoint}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [listKey] });
    },
    ...options,
  });
};

// DELETE - Remove data
export const useDeleteData = (
  listKey: string,
  endpoint: string,
  options: Record<string, unknown> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.delete(`${endpoint}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [listKey] });
    },
    ...options,
  });
};
