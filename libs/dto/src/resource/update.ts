import { createZodDto } from "nestjs-zod/dto";

import { resourceSchema } from "./project";

export const updateResourceSchema = resourceSchema.partial();

export class UpdateResourceDto extends createZodDto(updateResourceSchema) {}
