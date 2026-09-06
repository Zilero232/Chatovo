import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { DEVELOPERS_CACHE_TTL_MS } from './config';
import { UsersService } from './services';
import { UsersController } from './users.controller';

@Module({
  imports: [CacheModule.register({ ttl: DEVELOPERS_CACHE_TTL_MS })],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
