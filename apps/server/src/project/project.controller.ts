import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User as UserEntity } from "@prisma/client";

import { User } from "@/server/user/decorators/user.decorator";

import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { ProjectService } from "./project.service";
import { CreateProjectDto, UpdateProjectDto } from "@apitool/dto";
import { PrismaService } from "nestjs-prisma";

@ApiTags("Project")
@Controller("project")
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @UseGuards(TwoFactorGuard)
  findAll(@User() user: UserEntity) {
    return this.projectService.findAll(user.id);
  }

  @Post()
  @UseGuards(TwoFactorGuard)
  async create(@User() user: UserEntity, @Body() createProjectDto: CreateProjectDto) {
    const name = createProjectDto.name;

    return await this.prisma.$transaction(async (prisma) => {
      const app = await this.projectService.create(name, user, prisma);

      const updateProjectDto = new UpdateProjectDto();
      updateProjectDto.name = name;
      updateProjectDto.slug = app.id;
      await this.projectService.update(app.id, updateProjectDto, prisma);

      return app;
    })
  }
}
