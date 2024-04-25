import { createZodDto } from "nestjs-zod/dto";

import { organizationSchema } from "./organization";

export const updateResumeSchema = organizationSchema.partial();

export class UpdateResumeDto extends createZodDto(updateResumeSchema) {}
