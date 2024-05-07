import { createZodDto } from "nestjs-zod/dto";

import { groupPermissionSchema } from "./group-permission";

export const updateGroupPermissionSchema = groupPermissionSchema.partial();

export class UpdateGroupPermissionDto extends createZodDto(updateGroupPermissionSchema) {}
