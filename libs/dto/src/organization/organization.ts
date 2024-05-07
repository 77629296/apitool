import { idSchema } from "@apitool/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const organizationSchema = z.object({
  id: idSchema,
  name: z.string().nullable(),
  slug: z.string().nullable(),
});

export class OrganizationDto extends createZodDto(organizationSchema) {}
