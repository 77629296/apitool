import { MessageDto } from "@apitool/dto";
import { AxiosInstance, AxiosResponse } from "axios";

export const refresh = async (axios: AxiosInstance) => {
  const response = await axios.post<MessageDto, AxiosResponse<MessageDto>>("/auth/refresh");

  return response.data;
};
