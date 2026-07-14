import { createParamDecorator } from '@nestjs/common';

import type { ExecutionContext } from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<{ session?: UserSession }>();

  return request.session?.user.id ?? '';
});

export const CurrentSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserSession => {
    return ctx.switchToHttp().getRequest<{ session: UserSession }>().session;
  },
);
