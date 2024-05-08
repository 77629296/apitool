import { OrganizationDto } from "@apitool/dto";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { ORGANIZATIONS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const fetchOrganizations = async () => {
  const response = await axios.get<OrganizationDto[], AxiosResponse<OrganizationDto[]>>("/project");

  return response.data;
};

export const useOrganizations = () => {
  const {
    error,
    isPending: loading,
    data: organizations,
  } = useQuery({
    queryKey: ORGANIZATIONS_KEY,
    queryFn: fetchOrganizations,
  });

  return { organizations, loading, error };
};
