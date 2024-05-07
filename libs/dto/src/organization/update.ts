import { createZodDto } from "nestjs-zod/dto";

import { organizationSchema } from "./organization";

export const updateOrganizationSchema = organizationSchema.partial();

export class UpdateOrganizationDto extends createZodDto(updateOrganizationSchema) {}
