import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { AppDownloadsDto } from './dto/github.dto';
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
}
