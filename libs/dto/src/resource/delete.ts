import { idSchema } from "@apitool/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const deleteResourceSchema = z.object({
  id: idSchema,
});

export class DeleteResourceDto extends createZodDto(deleteResourceSchema) {}
