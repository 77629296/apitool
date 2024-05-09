import { idSchema } from "@apitool/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const projectEnvironmentSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  priority: z.number(),
  enabled: z.boolean(),
  default: z.boolean(),
  organizationId: z.string(),
  projectVersionId: z.string(),
  createdAt: z.date().or(z.dateString()),
  updatedAt: z.date().or(z.dateString()),
});

export class ProjectEnvironmentDto extends createZodDto(projectEnvironmentSchema) {}
