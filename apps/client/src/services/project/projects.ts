import { ProjectDto } from "@apitool/dto";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { PROJECTS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const fetchProjects = async () => {
  const response = await axios.get<ProjectDto[], AxiosResponse<ProjectDto[]>>("/project");

  return response.data;
};

export const useProjects = () => {
  const {
    error,
    isPending: loading,
    data: projects,
  } = useQuery({
    queryKey: PROJECTS_KEY,
    queryFn: fetchProjects,
  });

  return { projects, loading, error };
};
