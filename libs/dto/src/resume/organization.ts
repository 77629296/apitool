import { idSchema } from "@apitool/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const organizationSchema = z.object({
  id: idSchema,
  name: z.string(),
  createdAt: z.date().or(z.dateString()),
  updatedAt: z.date().or(z.dateString()),
});

export class OrganizationDto extends createZodDto(organizationSchema) {}
