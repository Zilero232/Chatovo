import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateProfileDto, UserProfileDto } from './dto/users.dto';
import { UsersService } from './users.service';

import type { UploadedAvatar } from './users.service';

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
    @CurrentUser() userId: string,
  ) {
    return this.users.updateProfile(userId, {
      displayName: body.displayName,
      profileUrl: body.profileUrl,
      bannerColor: body.bannerColor,
      bio: body.bio,
      removeAvatar: body.removeAvatar,
      avatar: avatar
        ? { mimetype: avatar.mimetype, size: avatar.size, buffer: avatar.buffer }
        : undefined,
    });
  }

  @Get(':id/profile')
  @ZodResponse({ type: UserProfileDto })
  getUserProfile(@Param('id') id: string) {
    return this.users.getUserProfile(id);
  }
}
