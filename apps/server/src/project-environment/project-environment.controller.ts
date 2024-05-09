import {
  Controller,
  Get,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User as UserEntity } from "@prisma/client";
import { User } from "@/server/user/decorators/user.decorator";

import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { ProjectEnvironmentService } from "./project-environment.service";
import { PrismaService } from "nestjs-prisma";

@ApiTags("ProjectEnvironment")
@Controller("projectEnvironment")
export class ProjectEnvironmentController {
  constructor(
    private readonly projectEnvironmentService: ProjectEnvironmentService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @UseGuards(TwoFactorGuard)
  index(@User() user: UserEntity, @Query('projectId') projectId: string) {
    const { organizationId } = user;
    return this.projectEnvironmentService.findAll({ organizationId, projectId });
  }
}
