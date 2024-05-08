import { createZodDto } from "nestjs-zod/dto";
import { projectSchema } from './project'

export const createProjectSchema = projectSchema.pick({
  name: true,
  slug: true,
  icon: true,
  isPublic: true,
  isMaintenanceOn: true,
  organizationId: true,
  userId: true,
});

export class CreateProjectDto extends createZodDto(createProjectSchema) {}
