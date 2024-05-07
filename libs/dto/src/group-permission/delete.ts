import { idSchema } from "@apitool/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const deleteGroupPermissionSchema = z.object({
  id: idSchema,
});

export class DeleteGroupPermissionDto extends createZodDto(deleteGroupPermissionSchema) {}
