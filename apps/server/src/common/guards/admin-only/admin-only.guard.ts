import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';

import { Injectable } from '@nestjs/common';

import { AppForbiddenException } from '../../../common/exceptions';
import { assertIsAdmin } from '../../../lib';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ session?: UserSession }>();
    const userId = request.session?.user.id;

    if (!userId) {
      throw new AppForbiddenException('ADMIN_ONLY', 'Admin only');
    }

    await assertIsAdmin(userId);

    return true;
  }
}
