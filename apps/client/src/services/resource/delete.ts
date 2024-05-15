import { DeleteResourceDto, ResourceDto } from "@apitool/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const deleteResource = async (data: DeleteResourceDto) => {
  const response = await axios.delete<ResourceDto, AxiosResponse<ResourceDto>, DeleteResourceDto>(
    `/resource/${data.id}`,
  );

  return response.data;
};

export const useDeleteResource = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: deleteResourceFn,
  } = useMutation({
    mutationFn: deleteResource,
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["resource", data.id] });

      queryClient.setQueryData<ResourceDto[]>(["resources"], (cache) => {
        if (!cache) return [];
        return cache.filter((resource) => resource.id !== data.id);
      });
    },
  });

  return { deleteResource: deleteResourceFn, loading, error };
};
