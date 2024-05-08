import { z } from "zod";

import { basicsSchema, defaultBasics } from "./basics";
import { defaultMetadata, metadataSchema } from "./metadata";
import { defaultSections, sectionsSchema } from "./sections";

// Schema
export const projectDataSchema = z.object({
  basics: basicsSchema,
  sections: sectionsSchema,
  metadata: metadataSchema,
});

// Type
export type ProjectData = z.infer<typeof projectDataSchema>;

// Defaults
export const defaultProjectData: ProjectData = {
  basics: defaultBasics,
  sections: defaultSections,
  metadata: defaultMetadata,
};

export * from "./basics";
export * from "./metadata";
export * from "./sample";
export * from "./sections";
export * from "./shared";
