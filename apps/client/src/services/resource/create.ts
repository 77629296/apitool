import { CreateResourceDto, ResourceDto } from "@apitool/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const createResource = async (data: CreateResourceDto) => {
  const response = await axios.post<ResourceDto, AxiosResponse<ResourceDto>, CreateResourceDto>(
    "/resource",
    data,
  );

  return response.data;
};

export const useCreateResource = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createResourceFn,
  } = useMutation({
    mutationFn: createResource,
    onSuccess: (data) => {
      queryClient.setQueryData<ResourceDto>(["resource", { id: data.id }], data);

      queryClient.setQueryData<ResourceDto[]>(["resources"], (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { createResource: createResourceFn, loading, error };
};
