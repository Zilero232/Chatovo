import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { LINK_PREVIEW, LINK_UNFURL } from './config';
import {
  LinkPreviewQueryDto,
  LinkPreviewResponseDto,
  RoomPreviewQueryDto
} from './dto/link-preview.dto';
import { LinkUnfurlService, RoomPreviewService } from './services';

@ApiTags('link-preview')
@Controller('link-preview')
export class LinkPreviewController {
  constructor(
    private readonly roomPreview: RoomPreviewService,
    private readonly linkUnfurl: LinkUnfurlService
  ) {}

  @Get()
  @Throttle({ default: LINK_UNFURL.throttle })
  @ZodResponse({ type: LinkPreviewResponseDto })
  getLinkPreview(@Query() query: LinkPreviewQueryDto) {
    return this.linkUnfurl.unfurl(query.url);
  }

  @AllowAnonymous()
  @Get('room')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', LINK_PREVIEW.cacheControl)
  getRoomPreview(@Query() query: RoomPreviewQueryDto) {
    return this.roomPreview.renderRoomPreview(query.id);
  }
}
