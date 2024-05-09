import { kebabCase } from "@apitool/utils";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const createProjectSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).transform(kebabCase).nullable(),
  icon: z.string().or(z.null()).optional(),
  isPublic: z.boolean(),
  isMaintenanceOn: z.boolean(),
});

export class CreateProjectDto extends createZodDto(createProjectSchema) {}
