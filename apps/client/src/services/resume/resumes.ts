import { ResumeDto } from "@apitool/dto";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { APITOOLS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const fetchResumes = async () => {
  const response = await axios.get<ResumeDto[], AxiosResponse<ResumeDto[]>>("/resume");

  return response.data;
};

export const useResumes = () => {
  const {
    error,
    isPending: loading,
    data: resumes,
  } = useQuery({
    queryKey: APITOOLS_KEY,
    queryFn: fetchResumes,
  });

  return { resumes, loading, error };
};
