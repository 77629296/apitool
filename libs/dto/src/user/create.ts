import { createZodDto } from "nestjs-zod/dto";
import { userSchema } from "./user";

export const createUserSchema = userSchema.pick({
  email: true,
  username: true,
  picture: true,
  locale: true,
  provider: true,
  emailVerified: true,
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
