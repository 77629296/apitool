import { z } from "zod";

export const customFieldSchema = z.object({
  id: z.string().uuid(),
  icon: z.string(),
  name: z.string(),
  value: z.string(),
});

export const customFieldsDefault = [];

export type CustomField = z.infer<typeof customFieldSchema>;
