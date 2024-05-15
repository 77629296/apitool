import { ResourceDto } from "@apitool/dto";

import { axios } from "@/client/libs/axios";

export const findResourceById = async (data: { id: string }) => {
  const response = await axios.get<ResourceDto>(`/resource/${data.id}`);

  return response.data;
};

export const findResourceByUsernameSlug = async (data: { username: string; slug: string }) => {
  const response = await axios.get<ResourceDto>(`/resource/public/${data.username}/${data.slug}`);

  return response.data;
};
