import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User as UserEntity } from "@prisma/client";

import { User } from "@/server/user/decorators/user.decorator";

import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { ProjectService } from "./project.service";
import { CreateProjectDto, ProjectDto, UpdateProjectDto } from "@apitool/dto";
import { PrismaService } from "nestjs-prisma";
import { Project } from "./decorators/project";

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

  @Get(":id")
  @UseGuards(TwoFactorGuard)
  findOne(@Project() project: ProjectDto) {
    return project;
  }

  @Post()
  @UseGuards(TwoFactorGuard)
  async create(@User() user: UserEntity, @Body() createProjectDto: CreateProjectDto) {
    const name = createProjectDto.name;

    return await this.prisma.$transaction(async (prisma) => {
      const project = await this.projectService.create(name, user, prisma);

      const updateProjectDto = new UpdateProjectDto();
      updateProjectDto.name = name;
      updateProjectDto.slug = project.id;
      updateProjectDto.icon = createProjectDto.icon;
      updateProjectDto.isMaintenanceOn = createProjectDto.isMaintenanceOn;
      updateProjectDto.isPublic = createProjectDto.isPublic;
      await this.projectService.update(project.id, updateProjectDto, prisma);

      return project;
    })
  }

  @Delete(":id")
  @UseGuards(TwoFactorGuard)
  remove(@User() user: UserEntity, @Param("id") id: string) {
    return this.projectService.remove(user.id, id);
  }
}
