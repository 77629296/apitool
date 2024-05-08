import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { ErrorMessage, processUsername } from "@apitool/utils";
import { RedisService } from "@songkeys/nestjs-redis";
import Redis from "ioredis";
import { PrismaService } from "nestjs-prisma";
import { CreateUserDto, OrganizationDto, UserDto } from "@apitool/dto";

@Injectable()
export class UserService {
  private readonly redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();
  }

  async findOneById(id: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: { secrets: true },
    });

    if (!user.secrets) {
      throw new InternalServerErrorException(ErrorMessage.SecretsNotFound);
    }

    return user;
  }

  async findOne(identifier: string) {
    const user = await (async (identifier: string) => {
      // First, find the user by email
      const user = await this.prisma.user.findUnique({
        where: { email: identifier },
        include: { secrets: true, organizationUsers: true },
      });
      // If the user exists, return it
      if (user) return user;

      // Otherwise, find the user by username
      return await this.prisma.user.findUnique({
        where: { username: identifier },
        include: { secrets: true, organizationUsers: true },
      });

    })(identifier);
    return user;
  }

  async findOneByIdentifier(identifier: string) {
    const user = await (async (identifier: string) => {
      // First, find the user by email
      const user = await this.prisma.user.findUnique({
        where: { email: identifier },
        include: { secrets: true, organizationUsers: true },
      });
      // If the user exists, return it
      if (user) return user;

      // Otherwise, find the user by username
      // If the user doesn't exist, throw an error
      return await this.prisma.user.findUniqueOrThrow({
        where: { username: identifier },
        include: { secrets: true, organizationUsers: true },
      });

    })(identifier);
    if (!user.secrets) {
      throw new InternalServerErrorException(ErrorMessage.SecretsNotFound);
    }

    return user;
  }

  async create({
    userProfile,
    organization,
    secrets,
    groups,
    existingUser,
    prisma,
  }: {
    userProfile: CreateUserDto,
    secrets: Object,
    organization: OrganizationDto,
    groups: string[],
    existingUser: UserDto | false,
    prisma: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
  }) {
    let user: UserDto;
    await this.prisma.$transaction(async () => {
      if (!existingUser) {
        user = await prisma.user.create({
          data: {
            ...userProfile,
            organizationId: organization.id,
            username: processUsername(userProfile.username ?? userProfile.email.split("@")[0]),
            secrets,
          },
          include: {
            secrets: true,
          },
        });
      } else {
        user = existingUser;
      }
      for (const group of groups) {
        const orgGroupPermission = await prisma.groupPermission.findUnique({
          where: {
            organizationId_group: {
              organizationId: organization.id,
              group
            }
          },
        });
        if (!orgGroupPermission) {
          throw new BadRequestException(`${group} group does not exist for current organization`);
        }
        await prisma.userGroupPermission.create({
          data: {
            groupPermissionId: orgGroupPermission.id,
            userId: user.id,
          }
        });
      }
    })
    return user!;
  }

  async updateByEmail(email: string, data: Prisma.UserUpdateArgs["data"]) {
    return await this.prisma.user.update({ where: { email }, data });
  }

  async updateByResetToken(resetToken: string, data: Prisma.SecretsUpdateArgs["data"]) {
    await this.prisma.secrets.update({ where: { resetToken }, data });
  }

  async deleteOneById(id: string) {
    await Promise.all([this.redis.del(`user:${id}:*`)]);

    return await this.prisma.user.delete({ where: { id } });
  }
}
