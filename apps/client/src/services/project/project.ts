import { ProjectDto } from "@apitool/dto";

import { axios } from "@/client/libs/axios";

export const findProjectById = async (data: { id: string }) => {
  const response = await axios.get<ProjectDto>(`/project/${data.id}`);

  return response.data;
};

export const findProjectByUsernameSlug = async (data: { username: string; slug: string }) => {
  const response = await axios.get<ProjectDto>(`/project/public/${data.username}/${data.slug}`);

  return response.data;
};
