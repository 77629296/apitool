import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { UserWithSecrets } from "@apitool/dto";
import { ErrorMessage } from "@apitool/utils";
import { Request } from "express";

import { ProjectService } from "../project.service";

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(private readonly projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserWithSecrets | false;

    try {
      const project = await this.projectService.findOne(
        request.params.id,
        user ? user.id : undefined,
      );

      // First check if the project is public, if yes, attach the project to the request payload.
      if (project.isPublic) {
        request.payload = { project };
      } else {
        if (user && user.id === project.userId) {
          request.payload = { project };
        } else {
          throw new NotFoundException(ErrorMessage.NotFound);
        }
      }
      return true;
    } catch {
      throw new NotFoundException(ErrorMessage.NotFound);
    }
  }
}
