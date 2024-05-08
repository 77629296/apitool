import { ProjectDto, UpdateProjectDto } from "@apitool/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import debounce from "lodash.debounce";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const updateProject = async (data: UpdateProjectDto) => {
  const response = await axios.patch<ProjectDto, AxiosResponse<ProjectDto>, UpdateProjectDto>(
    `/project/${data.id}`,
    data,
  );

  queryClient.setQueryData<ProjectDto>(["project", { id: response.data.id }], response.data);

  queryClient.setQueryData<ProjectDto[]>(["projects"], (cache) => {
    if (!cache) return [response.data];
    return cache.map((project) => {
      if (project.id === response.data.id) return response.data;
      return project;
    });
  });

  return response.data;
};

export const debouncedUpdateProject = debounce(updateProject, 500);

export const useUpdateProject = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updateProjectFn,
  } = useMutation({
    mutationFn: updateProject,
  });

  return { updateProject: updateProjectFn, loading, error };
};
