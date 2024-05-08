import { Project, User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      payload?: {
        project: Project;
      };
    }
  }
}

export {};
