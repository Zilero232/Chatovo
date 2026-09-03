import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';

import { Injectable } from '@nestjs/common';

import { assertNotBlocked } from '../../../lib';

@Injectable()
export class BlockedUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ session?: UserSession }>();
    const userId = request.session?.user.id;

    if (!userId) {
      return true;
    }

    await assertNotBlocked(userId);

    return true;
  }
}
