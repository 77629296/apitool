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
import { ResourceService } from "./resource.service";
import { CreateResourceDto, ResourceDto, UpdateResourceDto } from "@apitool/dto";
import { PrismaService } from "nestjs-prisma";
import { Resource } from "./decorators/resource";

@ApiTags("Resource")
@Controller("resource")
export class ResourceController {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @UseGuards(TwoFactorGuard)
  findAll() {
    return this.resourceService.findAll();
  }

  @Get(":id")
  @UseGuards(TwoFactorGuard)
  findOne(@Resource() resource: ResourceDto) {
    return resource;
  }

  @Post()
  @UseGuards(TwoFactorGuard)
  async create(@User() projectVersionId: string, @Body() createResourceDto: CreateResourceDto) {
    const name = createResourceDto.name;

    return await this.prisma.$transaction(async (prisma) => {
      const resource = await this.resourceService.create(name, projectVersionId, prisma);

      const updateResourceDto = new UpdateResourceDto();
      updateResourceDto.name = name;
      updateResourceDto.slug = resource.id;
      await this.resourceService.update(resource.id, updateResourceDto, prisma);

      return resource;
    })
  }

  @Delete(":id")
  @UseGuards(TwoFactorGuard)
  remove(@User() user: UserEntity, @Param("id") id: string) {
    return this.resourceService.remove(id);
  }
}
