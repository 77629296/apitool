import { idSchema } from "@apitool/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const deleteProjectEnvironmentSchema = z.object({
  id: idSchema,
});

export class DeleteProjectEnvironmentDto extends createZodDto(deleteProjectEnvironmentSchema) {}
