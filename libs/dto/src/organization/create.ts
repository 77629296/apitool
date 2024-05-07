import { kebabCase } from "@apitool/utils";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const createOrganizationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).transform(kebabCase).nullable(),
});

export class CreateOrganizationDto extends createZodDto(createOrganizationSchema) {}
