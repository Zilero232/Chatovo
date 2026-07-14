import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { AppDownloadsDto, GitHubReleaseDto } from './dto/github.dto';
import { GithubService } from './github.service';

@ApiTags('github')
@Controller('github')
export class GithubController {
  constructor(private readonly github: GithubService) {}

  @Public()
  @Get('releases/latest')
  @ZodResponse({ type: GitHubReleaseDto })
  getLatestRelease() {
    return this.github.getLatestRelease();
  }

  @Public()
  @Get('releases/downloads')
  @ZodResponse({ type: AppDownloadsDto })
  getAppDownloads() {
    return this.github.getAppDownloads();
  }
}
