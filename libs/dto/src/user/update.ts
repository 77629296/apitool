import { createZodDto } from "nestjs-zod/dto";

import { userSchema } from "./user";

export const updateUserSchema = userSchema.partial().pick({
  email: true,
  picture: true,
  locale: true,
  provider: true,
  emailVerified: true,
  username: true,
});

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
