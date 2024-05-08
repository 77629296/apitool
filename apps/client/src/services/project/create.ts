import { CreateProjectDto, ProjectDto } from "@apitool/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const createProject = async (data: CreateProjectDto) => {
  const response = await axios.post<ProjectDto, AxiosResponse<ProjectDto>, CreateProjectDto>(
    "/project",
    data,
  );

  return response.data;
};

export const useCreateProject = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createProjectFn,
  } = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      queryClient.setQueryData<ProjectDto>(["project", { id: data.id }], data);

      queryClient.setQueryData<ProjectDto[]>(["projects"], (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { createProject: createProjectFn, loading, error };
};
