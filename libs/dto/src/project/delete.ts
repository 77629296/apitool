import { idSchema } from "@apitool/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const deleteProjectSchema = z.object({
  id: idSchema,
});

export class DeleteProjectDto extends createZodDto(deleteProjectSchema) {}
