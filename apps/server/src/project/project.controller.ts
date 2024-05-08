import {
  Controller,
  Get,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User as UserEntity } from "@prisma/client";

import { User } from "@/server/user/decorators/user.decorator";

import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { ProjectService } from "./project.service";

@ApiTags("Project")
@Controller("project")
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
  ) {}

  @Get()
  @UseGuards(TwoFactorGuard)
  findAll(@User() user: UserEntity) {
    return this.projectService.findAll(user.id);
  }
}
