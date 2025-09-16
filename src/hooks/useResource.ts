import { useState } from "react";
import {
  useCreateData,
  useDeleteData,
  useFetchData,
  useUpdateData,
} from "./useApi";

const useResource = (
  resourceName = "member", // base name e.g. "role"
  endpoints = {
    list: "",
    item: "",
    create: "",
    update: "",
    delete: "",
  },
  filters: { limit?: number; [key: string]: any } = {}
) => {
  const [page, setPage] = useState(1);
  const limit = filters.limit ?? 10;

  // listKey should be consistent and used for invalidation
  const listKey = `${resourceName}List`;
  const itemKey = `${resourceName}Item`;

  const {
    data: list,
    refetch: refresh,
    isLoading: isListLoading,
    isError: isListError,
  } = useFetchData(
    listKey,
    endpoints.list,
    {
      page,
      limit,
      ...filters,
    },
    { enabled: true }
  );

  const {
    data: item,
    isLoading: isItemLoading,
    isError: isItemError,
    refetch: getItem,
  } = useFetchData(itemKey, endpoints.item, { ...filters }, { enabled: false });

  const {
    mutate: createResource,
    isPending: isCreatePending,
    isError: isCreateError,
  } = useCreateData(listKey, endpoints.create);

  const {
    mutate: updateResource,
    isPending: isUpdatePending,
    isError: isUpdateError,
  } = useUpdateData(listKey, endpoints.update);

  const {
    mutate: deleteResource,
    isPending: isDeletePending,
    isError: isDeleteError,
  } = useDeleteData(listKey, endpoints.delete);

  return {
    list,
    refresh, // call this to refetch list manually
    item,
    getItem,
    createResource,
    updateResource,
    deleteResource,
    setPage,
    page,
    isListLoading,
    isListError,
    isItemLoading,
    isItemError,
    isCreatePending,
    isCreateError,
    isUpdatePending,
    isUpdateError,
    isDeletePending,
    isDeleteError,
  };
};

export default useResource;
