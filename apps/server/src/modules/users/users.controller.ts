import { CacheInterceptor } from '@nestjs/cache-manager';
import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import type { UploadedAvatar } from './users.types';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DeveloperListDto, UpdateProfileDto, UserProfileDto } from './dto/users.dto';
import { UsersService } from './services';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('profile')
  @UseInterceptors(FileInterceptor('avatar'))
  @ZodResponse({ type: UserProfileDto })
  updateProfile(
    @Body() body: UpdateProfileDto,
    @UploadedFile() avatar: UploadedAvatar | undefined,
    @CurrentUser() userId: string
  ) {
    return this.users.updateProfile({
      userId,
      input: {
        displayName: body.displayName,
        profileUrl: body.profileUrl,
        bannerColor: body.bannerColor,
        bio: body.bio,
        removeAvatar: body.removeAvatar,
        avatar: avatar
          ? { mimetype: avatar.mimetype, size: avatar.size, buffer: avatar.buffer }
          : undefined
      }
    });
  }

  @UseInterceptors(CacheInterceptor)
  @Get('developers')
  @ZodResponse({ type: DeveloperListDto })
  listDevelopers() {
    return this.users.listDevelopers();
  }

  @Get(':id/profile')
  @ZodResponse({ type: UserProfileDto })
  getUserProfile(@Param('id') id: string) {
    return this.users.getUserProfile(id);
  }
}
