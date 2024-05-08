import { DeleteProjectDto, ProjectDto } from "@apitool/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const deleteProject = async (data: DeleteProjectDto) => {
  const response = await axios.delete<ProjectDto, AxiosResponse<ProjectDto>, DeleteProjectDto>(
    `/project/${data.id}`,
  );

  return response.data;
};

export const useDeleteProject = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: deleteProjectFn,
  } = useMutation({
    mutationFn: deleteProject,
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["project", data.id] });

      queryClient.setQueryData<ProjectDto[]>(["projects"], (cache) => {
        if (!cache) return [];
        return cache.filter((project) => project.id !== data.id);
      });
    },
  });

  return { deleteProject: deleteProjectFn, loading, error };
};
