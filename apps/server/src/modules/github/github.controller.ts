import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CONTRIBUTORS_CACHE_TTL_MS } from './config';
import { AppDownloadsDto, ContributorListDto } from './dto/github.dto';
import { GithubService } from './services';

@ApiTags('github')
@Controller('github')
@UseInterceptors(CacheInterceptor)
export class GithubController {
  constructor(private readonly github: GithubService) {}

  @AllowAnonymous()
  @Get('releases/downloads')
  @ZodResponse({ type: AppDownloadsDto })
  getAppDownloads() {
    return this.github.getAppDownloads();
  }

  @AllowAnonymous()
  @CacheTTL(CONTRIBUTORS_CACHE_TTL_MS)
  @Get('contributors')
  @ZodResponse({ type: ContributorListDto })
  getContributors() {
    return this.github.getContributors();
  }
}
