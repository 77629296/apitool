import { ResourceDto, UpdateResourceDto } from "@apitool/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import debounce from "lodash.debounce";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const updateResource = async (data: UpdateResourceDto) => {
  const response = await axios.patch<ResourceDto, AxiosResponse<ResourceDto>, UpdateResourceDto>(
    `/project/${data.id}`,
    data,
  );

  queryClient.setQueryData<ResourceDto>(["project", { id: response.data.id }], response.data);

  queryClient.setQueryData<ResourceDto[]>(["projects"], (cache) => {
    if (!cache) return [response.data];
    return cache.map((project) => {
      if (project.id === response.data.id) return response.data;
      return project;
    });
  });

  return response.data;
};

export const debouncedUpdateResource = debounce(updateResource, 500);

export const useUpdateResource = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updateResourceFn,
  } = useMutation({
    mutationFn: updateResource,
  });

  return { updateResource: updateResourceFn, loading, error };
};
