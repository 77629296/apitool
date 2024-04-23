import { resumeDataSchema } from "@apitool/schema";
import { kebabCase } from "@apitool/utils";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const importResumeSchema = z.object({
  title: z.string().optional(),
  slug: z.string().min(1).transform(kebabCase).optional(),
  visibility: z.enum(["public", "private"]).default("private").optional(),
  data: resumeDataSchema,
});

export class ImportResumeDto extends createZodDto(importResumeSchema) {}
