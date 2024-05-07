import { idSchema } from "@apitool/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

import { secretsSchema } from "../secrets";

export const usernameSchema = z
  .string()
  .min(3)
  .max(255)
  .regex(/^[a-z0-9._-]+$/, {
    message:
      "Usernames can only contain lowercase letters, numbers, periods, hyphens, and underscores.",
  });

export const userSchema = z.object({
  id: idSchema,
  organizationId: idSchema,
  picture: z.literal("").or(z.null()).or(z.undefined()).or(z.string().url()),
  username: z.string().or(z.undefined()),
  email: z.string().email(),
  locale: z.string().default("en-US"),
  emailVerified: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
  role: z.string(),
  phoneNumber: z.string().or(z.null()),
  password: z.string().or(z.null()).or(z.undefined()),
  provider: z.enum(["email", "github", "google"]).default("email"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class UserDto extends createZodDto(userSchema) {}

export const userWithSecretsSchema = userSchema.merge(z.object({ secrets: secretsSchema }));

export class UserWithSecrets extends createZodDto(userWithSecretsSchema) {}
