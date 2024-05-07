import { idSchema } from "@apitool/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const groupPermissionSchema = z.object({
  id: idSchema,
  group: z.string().min(1),
  projectCreate: z.boolean().default(false),
  projectDelete: z.boolean().default(false),
  createdAt: z.date().or(z.dateString()).or(z.null()),
  updatedAt: z.date().or(z.dateString()).or(z.null()),
});

export class GroupPermissionDto extends createZodDto(groupPermissionSchema) {}
