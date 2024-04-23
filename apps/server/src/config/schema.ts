import { z } from "nestjs-zod/z";

export const configSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("production"),

  // Ports
  PORT: z.coerce.number().default(3000),

  // Client URL (only for development environments)
  __DEV__CLIENT_URL: z.string().url().optional(),

  // URLs
  PUBLIC_URL: z.string().url(),

  // Database (Prisma)
  DATABASE_URL: z.string().url().startsWith("postgresql://"),

  // Authentication Secrets
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),

  // Mail Server
  MAIL_FROM: z.string().includes("@").optional().default("noreply@localhost"),
  SMTP_URL: z.string().url().refine(url => url.startsWith("smtp://") || url.startsWith("smtps://")).optional(),

  // Redis
  REDIS_URL: z.string().url().startsWith("redis://").optional(),

  // Crowdin (Optional)
  CROWDIN_PROJECT_ID: z.coerce.number().optional(),
  CROWDIN_PERSONAL_TOKEN: z.string().optional(),

  // Email (Optional)
  DISABLE_EMAIL_AUTH: z
    .string()
    .default("false")
    .transform((s) => s !== "false" && s !== "0"),

  // GitHub (OAuth)
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_CALLBACK_URL: z.string().url().optional(),

  // Google (OAuth)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().url().optional(),
});

export type Config = z.infer<typeof configSchema>;
