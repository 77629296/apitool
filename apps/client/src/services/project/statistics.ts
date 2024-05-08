import { StatisticsDto } from "@apitool/dto";
import { useQuery } from "@tanstack/react-query";

import { PROJECT_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const findProjectStatisticsById = async (data: { id: string }) => {
  const response = await axios.get<StatisticsDto>(`/project/${data.id}/statistics`);

  return response.data;
};

export const useProjectStatistics = (id: string, enabled = false) => {
  const {
    error,
    isPending: loading,
    data: statistics,
  } = useQuery({
    queryKey: [...PROJECT_KEY, "statistics", id],
    queryFn: () => findProjectStatisticsById({ id }),
    enabled,
  });

  return { statistics, loading, error };
};
