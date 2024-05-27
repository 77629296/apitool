import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { RedisService } from "@songkeys/nestjs-redis";
import Redis from "ioredis";
import { User, Resource } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { PrismaClient } from "@prisma/client";
import { UpdateResourceDto } from "@apitool/dto";


@Injectable()
export class ResourceService {
  private readonly redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();
  }

  findAll() {
    return this.prisma.resource.findMany({ orderBy: { updatedAt: "desc" } });
  }

  async create(name: string, projectVersionId: string, prisma?: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">): Promise<Resource> {
    if (!prisma) {
      prisma = this.prisma
    }
    return await this.prisma.$transaction(async () => {
      const resource = await prisma.resource.create({
        data: {
          name,
          type: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          projectVersionId,
        }
      })

      return resource
    })
  }

  async update(resourceId: string, updateResourceDto: UpdateResourceDto, prisma?: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) {
    if (!prisma) {
      prisma = this.prisma
    }
    return await this.prisma.$transaction(async () => {
      return await prisma.resource.update({
        data: updateResourceDto,
        where: {
          id: resourceId
        },
      });
    })
  }

  async remove(id: string) {
    return this.prisma.resource.delete({ where: { id } });
  }
}
