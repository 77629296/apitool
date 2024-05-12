import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { RedisService } from "@songkeys/nestjs-redis";
import Redis from "ioredis";
import { User, Project, ProjectVersion } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { PrismaClient } from "@prisma/client";
import { ProjectEnvironmentService } from "../project-environment/project-environment.service";
import { UpdateProjectDto } from "@apitool/dto";


@Injectable()
export class ProjectService {
  private readonly redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly projectEnvironmentService: ProjectEnvironmentService,
  ) {
    this.redis = this.redisService.getClient();
  }

  findOne(id: string, userId?: string) {
    if (userId) {
      return this.prisma.project.findUniqueOrThrow({ where: { userId, id } });
    }

    return this.prisma.project.findUniqueOrThrow({ where: { id } });
  }

  findAll(userId: string) {
    return this.prisma.project.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  }

  async createVersion({
    user,
    project,
    versionName,
    versionFromId,
    prisma
  }: {
    user: User,
    project: Project,
    versionName: string,
    versionFromId: string | null,
    prisma?: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
  }
  ): Promise<ProjectVersion> {
    if (!prisma) {
      prisma = this.prisma
    }
    return this.prisma.$transaction(async () => {
      let versionFrom: ProjectVersion | undefined;
      const { organizationId } = user;
      if (versionFromId) {
        try {
          versionFrom = await prisma?.projectVersion.findUniqueOrThrow({
            where: { id: versionFromId },
          });
        } catch (error) {
        }
      }

      const noOfVersions = await prisma?.projectVersion.count({ where: { projectId: project?.id } });

      if (noOfVersions && !versionFrom) {
        throw new BadRequestException('Version from should not be empty');
      }

      const versionNameExists = await prisma?.projectVersion.findUnique({
        where: {
          name_projectId: {
            name: versionName,
            projectId: project.id
          }
        },
      });

      if (versionNameExists) {
        throw new BadRequestException('Version name already exists.');
      }

      const firstPriorityEnv = await this.projectEnvironmentService.get(organizationId, null, true, prisma);

      const projectVersion = await prisma.projectVersion.create({
        data: {
          name: versionName,
          projectId: project.id,
          currentEnvironmentId: firstPriorityEnv?.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
      );
      return projectVersion;
    })
  }

  fetchDefaultAppGroupPermissions(group: string): {
    read: boolean;
    update: boolean;
    delete: boolean;
  } {
    switch (group) {
      case 'all_users':
        return { read: true, update: false, delete: false };
      case 'admin':
        return { read: true, update: true, delete: true };
      default:
        throw `${group} is not a default group`;
    }
  }

  async createAppGroupPermissionsForAdmin(project: Project, prisma: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">): Promise<void> {
    this.prisma.$transaction(async () => {
      const orgDefaultGroupPermissions = await prisma.groupPermission.findMany({
        where: {
          organizationId: project.organizationId,
          group: 'admin',
        },
      });

      for (const groupPermission of orgDefaultGroupPermissions) {
        prisma.projectGroupPermission.create({
          data: {
            groupPermissionId: groupPermission.id,
            projectId: project.id,
            ...this.fetchDefaultAppGroupPermissions(groupPermission.group),
          }
        });
      }
    })
  }

  async create(name: string, user: User, prisma?: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">): Promise<Project> {
    if (!prisma) {
      prisma = this.prisma
    }
    return await this.prisma.$transaction(async () => {
      const project = await prisma.project.create({
        data: {
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
          organizationId: user.organizationId,
          userId: user.id,
        }
      })

      //create default app version
      await this.createVersion({
        user,
        project,
        versionName: 'v1',
        versionFromId: null,
        prisma,
      });

      await prisma.projectUser.create({
        data: {
          userId: user.id,
          projectId: project.id,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })

      await this.createAppGroupPermissionsForAdmin(project, prisma);

      return project
    })
  }

  async update(projectId: string, updateProjectDto: UpdateProjectDto, prisma?: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) {
    if (!prisma) {
      prisma = this.prisma
    }
    return await this.prisma.$transaction(async () => {
      if (updateProjectDto.currentVersionId) {
        //check if the app version is eligible for release
        const currentEnvironment = await prisma.projectEnvironment.findFirst({
          select: {
            id: true,
            default: true,
          },
          where: {
            projectVersions: {
              some: {
                id: updateProjectDto.currentVersionId,
              },
            },
          },
        });

        if (!currentEnvironment?.default) {
          throw new BadRequestException('You can only release when the version is promoted to production');
        }
      }
      return await prisma.project.update({
        data: updateProjectDto,
        where: {
          id: projectId
        },
      });
    })
  }

  async remove(userId: string, id: string) {
    return this.prisma.project.delete({ where: { userId, id } });
  }
}
