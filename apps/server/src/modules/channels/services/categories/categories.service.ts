import { Injectable } from '@nestjs/common';
import { isNonNullish, isNullish } from 'remeda';

import type {
  CreateCategoryInput,
  DeleteCategoryInput,
  ReorderCategoriesInput,
  UpdateCategoryInput
} from './categories.service.types';

import { AppConflictException, AppNotFoundException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { assertServerPermission, categorySelect } from '../../../../lib';
import { emitServerEvent } from '../../../realtime';
import { mapCategory } from '../../lib';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertCategoryNameAvailable({
    serverId,
    name
  }: {
    serverId: string;
    name: string;
  }) {
    const existing = await this.prisma.category.findUnique({
      where: { serverId_name: { serverId, name } },
      select: { id: true }
    });

    if (isNonNullish(existing)) {
      throw new AppConflictException(
        'CATEGORY_NAME_TAKEN',
        'A category with this name already exists'
      );
    }
  }

  async createCategory({ serverId, input, userId }: CreateCategoryInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageChannels' });
    await this.assertCategoryNameAvailable({ serverId, name: input.name });

    const last = await this.prisma.category.findFirst({
      where: { serverId },
      orderBy: { position: 'desc' },
      select: { position: true }
    });

    const created = await this.prisma.category.create({
      data: { serverId, name: input.name, position: (last?.position ?? -1) + 1 },
      select: categorySelect
    });

    const category = mapCategory(created);

    emitServerEvent(serverId, { type: 'category.create', serverId, category });

    return category;
  }

  async updateCategory({ serverId, categoryId, input, userId }: UpdateCategoryInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageChannels' });

    const current = await this.prisma.category.findFirst({
      where: { id: categoryId, serverId },
      select: { name: true }
    });

    if (isNullish(current)) {
      throw new AppNotFoundException('CATEGORY_NOT_FOUND', 'Category not found');
    }

    if (isNonNullish(input.name) && input.name !== current.name) {
      await this.assertCategoryNameAvailable({ serverId, name: input.name });
    }

    const updated = await this.prisma.category.update({
      where: { id: categoryId },
      data: { name: input.name, position: input.position },
      select: categorySelect
    });

    const category = mapCategory(updated);

    emitServerEvent(serverId, { type: 'category.update', serverId, category });

    return category;
  }

  async deleteCategory({ serverId, categoryId, userId }: DeleteCategoryInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageChannels' });

    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, serverId },
      select: { id: true }
    });

    if (isNullish(category)) {
      throw new AppNotFoundException('CATEGORY_NOT_FOUND', 'Category not found');
    }

    await this.prisma.category.delete({ where: { id: categoryId } });

    emitServerEvent(serverId, { type: 'category.delete', serverId, categoryId });
  }

  async reorderCategories({ serverId, input, userId }: ReorderCategoriesInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageChannels' });

    await this.prisma.$transaction(
      input.categories.map(({ id, position }) =>
        this.prisma.category.update({ where: { id, serverId }, data: { position } })
      )
    );

    const categories = await this.prisma.category.findMany({
      where: { serverId },
      orderBy: { position: 'asc' },
      select: categorySelect
    });

    const mapped = categories.map(mapCategory);

    mapped.forEach((category) => {
      emitServerEvent(serverId, { type: 'category.update', serverId, category });
    });

    return mapped;
  }
}
