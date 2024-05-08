import { ProjectDto } from "@apitool/dto";
import { useMutation } from "@tanstack/react-query";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

type LockProjectArgs = {
  id: string;
  set: boolean;
};

export const lockProject = async ({ id, set }: LockProjectArgs) => {
  const response = await axios.patch(`/project/${id}/lock`, { set });

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

export const useLockProject = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: lockProjectFn,
  } = useMutation({
    mutationFn: lockProject,
  });

  return { lockProject: lockProjectFn, loading, error };
};
