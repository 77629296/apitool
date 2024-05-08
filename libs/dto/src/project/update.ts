import { createZodDto } from "nestjs-zod/dto";

import { projectSchema } from "./project";

export const updateProjectSchema = projectSchema.partial();

export class UpdateProjectDto extends createZodDto(updateProjectSchema) {}
