import { idSchema } from "@apitool/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const deleteOrganizationSchema = z.object({
  id: idSchema,
});

export class DeleteOrganizationDto extends createZodDto(deleteOrganizationSchema) {}
