import {
  Injectable,
} from "@nestjs/common";
import { ProjectDto, UserDto, GroupPermissionDto } from "@apitool/dto";
import { WORKSPACE_USER_STATUS } from "@apitool/utils";
import { RedisService } from "@songkeys/nestjs-redis";
import Redis from "ioredis";
import { PrismaService } from "nestjs-prisma";
import { PrismaClient } from "@prisma/client";

type UserFilterOptions = { searchText?: string };

@Injectable()
export class ProjectService {
  private readonly redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();
  }

  findAll(userId: string) {
    return this.prisma.project.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  }
}
