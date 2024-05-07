import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const createGroupPermissionSchema = z.object({
  group: z.string().min(1),
});

export class CreateGroupPermissionDto extends createZodDto(createGroupPermissionSchema) {}
