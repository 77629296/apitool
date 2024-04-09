import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { createQueryBuilder, EntityManager, Repository } from 'typeorm';
import { buildTree, dbTransactionForAppVersionAssociationsUpdate } from 'src/helpers/utils.helper';
import { CreateResourceDto, UpdateResourceDto } from '@dto/resources.dto';
import { Resource } from 'src/entities/resource.entity';
import { EventsService } from './events_handler.service';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    private eventHandlerService: EventsService
  ) {}

  async findResourcesForVersion(appVersionId: string): Promise<Resource[]> {
    const allResources = await this.resourceRepository.find({ appVersionId });
    return allResources;
  }

  async findOne(id: string): Promise<Resource> {
    return this.resourceRepository.findOne(id);
  }

  async createResource(resource: CreateResourceDto, appVersionId: string): Promise<Resource> {
    return dbTransactionForAppVersionAssociationsUpdate(async (manager) => {
      const newResource = new Resource();
      newResource.id = resource.id;
      newResource.pid = resource.pid;
      newResource.name = resource.name;
      newResource.type = resource.type;
      newResource.index = resource.index;
      newResource.disabled = resource.disabled;
      newResource.appVersionId = appVersionId;

      return await manager.save(Resource, newResource);
    }, appVersionId);
  }

  async updateResource(resourceUpdates: UpdateResourceDto, appVersionId: string) {
    if (Object.keys(resourceUpdates.diff).length > 1) {
      return this.updateResourcesOrder(resourceUpdates.diff, appVersionId);
    }

    const currentResource = await this.resourceRepository.findOne(resourceUpdates.resourceId);
    if (!currentResource) {
      throw new Error('Resource not found');
    }
    return this.resourceRepository.update(resourceUpdates.resourceId, resourceUpdates.diff[0]);
  }

  async updateResourcesOrder(resources, appVersionId: string) {
    const resourcesToResource = resources.map((resource) => {
      return {
        id: resource.id,
        index: resource.index,
      };
    });

    return await dbTransactionForAppVersionAssociationsUpdate(async (manager: EntityManager) => {
      await Promise.all(
        resourcesToResource.map(async (resource) => {
          await manager.update(Resource, resource.id, resource);
        })
      );
    }, appVersionId);
  }

  async deleteResource(resourceId: string, appVersionId: string) {
    return dbTransactionForAppVersionAssociationsUpdate(async (manager: EntityManager) => {
      const resourceExists = await manager.findOne(Resource, resourceId);

      if (!resourceExists) {
        throw new Error('Resource not found');
      }
      this.eventHandlerService.cascadeDeleteEvents(resourceExists.id);
      const resourceDeletedIndex = resourceExists.index;
      const resourceDeleted = await this.resourceRepository.delete(resourceId);

      if (resourceDeleted.affected === 0) {
        throw new Error('Resource not deleted');
      }

      const resources = await this.resourceRepository.find({ appVersionId: resourceExists.appVersionId });

      const rearrangedResources = this.rearrangeResourcesOnDelete(resources, resourceDeletedIndex);

      return await Promise.all(
        rearrangedResources.map(async (resource) => {
          await manager.update(Resource, resource.id, resource);
        })
      );
    }, appVersionId);
  }

  rearrangeResourcesOnDelete(resources: Resource[], resourceDeletedIndex: number) {
    const rearrangedResources = resources.map((resource, index) => {
      if (index + 1 >= resourceDeletedIndex) {
        return {
          ...resource,
          index: resource.index - 1,
        };
      }

      return resource;
    });

    return rearrangedResources;
  }

  async getMenuTree(
    user: User,
    options: {
      appVersionId: string;
    }
  ): Promise<Resource[]> {
    const viewableResourceQb = createQueryBuilder(Resource, 'resources')
      .where('resources.app_version_id = :appVersionId', {
        appVersionId: options.appVersionId,
      })
      .orderBy('resources.index', 'ASC');

    /**
     * 1.获取应用当前版本的所有资源
     * 2.遍历pid 拼接菜单树
     */
    const resourceMenus = await viewableResourceQb.getMany();
    const menuTree = buildTree(resourceMenus);

    return menuTree;
  }
}
