import {
  Injectable,
} from "@nestjs/common";
import { OrganizationDto, UserDto, GroupPermissionDto } from "@apitool/dto";
import { WORKSPACE_USER_STATUS } from "@apitool/utils";
import { RedisService } from "@songkeys/nestjs-redis";
import Redis from "ioredis";
import { PrismaService } from "nestjs-prisma";
import { PrismaClient } from "@prisma/client";

type UserFilterOptions = { searchText?: string };

@Injectable()
export class OrganizationService {
  private readonly redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();
  }


  async createDefaultGroupPermissionsForOrganization(organization: OrganizationDto, prisma: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) {
    const defaultGroups = ['all_users', 'admin'];
    return await this.prisma.$transaction(async () => {
      const createdGroupPermissions: GroupPermissionDto[] = [];
      for (const group of defaultGroups) {
        const isAdmin = group === 'admin';
        const groupPermission = await prisma.groupPermission.create({
          data: {
            organizationId: organization.id,
            group: group,
            projectCreate: isAdmin,
            projectDelete: isAdmin,
          },
        });
        createdGroupPermissions.push(groupPermission);
      }
      return createdGroupPermissions;
    });
  }

  async create(name: string, slug: string, user: UserDto | null, prisma: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">): Promise<OrganizationDto> {
    let organization: OrganizationDto;
    return await this.prisma.$transaction(async () => {

      organization = await prisma.organization.create({
        data: {
          name,
          slug,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await this.createDefaultGroupPermissionsForOrganization(
        organization,
        prisma,
      );
      return organization;
    });
  }

  async get(id: string): Promise<OrganizationDto> {
    return await this.prisma.organization.findUniqueOrThrow({
      where: { id },
    });
  }

  async fetchOrganization(slug: string): Promise<OrganizationDto | null> {
    let organization: OrganizationDto | null;
    try {
      organization = await this.prisma.organization.findUnique({
        where: { slug },
        select: { id: true, slug: true, name: true },
      });
    } catch (error) {
      organization = await this.prisma.organization.findUnique({
        where: { id: slug },
        select: { id: true, slug: true, name: true },
      });
    }
    return organization;
  }

  async getSingleOrganization(): Promise<OrganizationDto | null> {
    return await this.prisma.organization.findFirst();
  }



  async fetchUsersByValue(user: UserDto, searchInput: string): Promise<any> {
    if (!searchInput) {
      return [];
    }
    const options = {
      searchText: searchInput,
    };

    const query = this.organizationUsersQuery(user.organizationId, options);
    const organizationUsers = await this.prisma.organizationUser.findMany(query);

    return organizationUsers?.map((orgUser) => {
      return {
        email: orgUser.user.email,
        name: orgUser.user?.name,
        username: orgUser.user?.username,
        id: orgUser.id,
        userId: orgUser.user.id,
      };
    });
  }

  organizationUsersQuery(organizationId: string, options: UserFilterOptions) {
    return {
      where: {
        organizationId,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            username: true,
            id: true,
            groupPermissions: {
              where: {
                organizationId,
              },
            },
          },
        },
      },
    };
  }

  async fetchOrganizations(user: any): Promise<OrganizationDto[]> {
    const organizations = await this.prisma.organization.findMany({
      where: {
        organizationUsers: {
          some: {
            userId: user.id,
            status: WORKSPACE_USER_STATUS.ACTIVE,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return organizations;
  }

  constructOrgFindQuery(slug: string, id: string, statusList?: Array<boolean>) {
    const query = {
      ...(slug && { where: { slug } }),
      ...(id && { where: { id } }),
      include: { ssoConfigs: true },
    };

    return query;
  }
}
