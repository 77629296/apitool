import {
  Injectable,
} from "@nestjs/common";
import { RedisService } from "@songkeys/nestjs-redis";
import Redis from "ioredis";
import { ProjectEnvironment } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class ProjectEnvironmentService {
  private readonly redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();
  }

  async get(
    organizationId: string,
    id?: string | null,
    priorityCheck = false,
    prisma?: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
  ): Promise<ProjectEnvironment> {
    if (!prisma) {
      prisma = this.prisma
    }
    const projectEnvironment =  await prisma.projectEnvironment.findMany({
      where: { organizationId, ...(id ? { id } : !priorityCheck && { isDefault: true }) },
      orderBy: { priority: 'asc' },
    });
    return projectEnvironment[0]
  }

  findAll({
    organizationId,
    projectId,
    prisma,
  }: {
    organizationId: string,
    projectId: string,
    prisma?: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
  }): Promise<ProjectEnvironment[]> {
    if (!prisma) {
      prisma = this.prisma
    }
    return this.prisma.$transaction(async () => {
      const projectEnvironments = await prisma.projectEnvironment.findMany({
        where: {
          organizationId,
          enabled: true,
        },
        orderBy: {
          priority: 'asc',
        },
      });

      if (projectId) {
        for (const projectEnvironment of projectEnvironments) {
          const count = await prisma.projectVersion.count({
            where: {
              ...(projectEnvironment.priority !== 1 && { currentEnvironmentId: projectEnvironment.id }),
              projectId,
            },
          });
          const modifiedProject = projectEnvironment as ProjectEnvironment & { projectVersionsCount: number };
          modifiedProject['projectVersionsCount'] = count;
        }
      }

      return projectEnvironments;
    })
  }
}
