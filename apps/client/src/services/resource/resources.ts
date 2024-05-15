import { ResourceDto } from "@apitool/dto";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { PROJECTS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const fetchResources = async () => {
  const response = await axios.get<ResourceDto[], AxiosResponse<ResourceDto[]>>("/resource");

  return response.data;
};

export const useResources = () => {
  const {
    error,
    isPending: loading,
    data: resources,
  } = useQuery({
    queryKey: PROJECTS_KEY,
    queryFn: fetchResources,
  });

  return { resources, loading, error };
};
