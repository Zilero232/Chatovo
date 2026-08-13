import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { RELEASES_CACHE_TTL_MS } from './config';
import { GithubController } from './github.controller';
import { GithubService } from './services';

@Module({
  imports: [CacheModule.register({ ttl: RELEASES_CACHE_TTL_MS })],
  controllers: [GithubController],
  providers: [GithubService]
})
export class GithubModule {}
