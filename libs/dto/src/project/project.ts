import { idSchema } from "@apitool/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const projectSchema = z.object({
  id: idSchema,
  name: z.string(),
  slug: z.string(),
  icon: z.string().or(z.null()),
  isPublic: z.boolean(),
  isMaintenanceOn: z.boolean(),
  currentVersionId: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  createdAt: z.date().or(z.dateString()),
  updatedAt: z.date().or(z.dateString()),
});

export class ProjectDto extends createZodDto(projectSchema) {}
