import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const createProjectEnvironmentSchema = z.object({
  name: z.string().min(1),
  priority: z.number(),
  enabled: z.boolean(),
  default: z.boolean(),
});

export class CreateProjectEnvironmentDto extends createZodDto(createProjectEnvironmentSchema) {}
