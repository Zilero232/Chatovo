import type { Response } from 'express';

import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { IMAGES } from './config';
import { OptimizeImageQueryDto } from './dto/images.dto';
import { ImagesService } from './services';

@ApiTags('images')
@Controller('images')
@Throttle({ default: IMAGES.throttle })
export class ImagesController {
  constructor(private readonly images: ImagesService) {}

  @AllowAnonymous()
  @Get()
  async optimizeImage(
    @Query() query: OptimizeImageQueryDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { buffer, cacheControl } = await this.images.optimize({
      url: query.url,
      width: query.w,
      quality: query.q
    });

    response.set({ ...IMAGES.responseHeaders, 'Cache-Control': cacheControl });

    return new StreamableFile(buffer, {
      type: IMAGES.contentType,
      disposition: 'inline',
      length: buffer.byteLength
    });
  }
}
