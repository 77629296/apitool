import { createZodDto } from "nestjs-zod/dto";

import { projectEnvironmentSchema } from "./project-environment";

export const updateProjectEnvironmentSchema = projectEnvironmentSchema.partial();

export class UpdateProjectEnvironmentDto extends createZodDto(updateProjectEnvironmentSchema) {}
