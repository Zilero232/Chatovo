import { Module } from '@nestjs/common';

import { GithubController } from './github.controller';
import { GithubService } from './services';

@Module({
  controllers: [GithubController],
  providers: [GithubService]
})
export class GithubModule {}
