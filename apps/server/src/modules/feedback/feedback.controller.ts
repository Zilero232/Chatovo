import { Body, Controller, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { decodeUploadName } from '../../lib';
import { ReportProblemDto, ReportProblemResultDto } from './dto/feedback.dto';
import { FeedbackService } from './services';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedback: FeedbackService) {}

  @Post()
  @HttpCode(200)
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @UseInterceptors(FileInterceptor('screenshot'))
  @ZodResponse({ type: ReportProblemResultDto })
  async reportProblem(
    @Body() body: ReportProblemDto,
    @CurrentUser() userId: string,
    @UploadedFile() screenshot?: Express.Multer.File
  ) {
    const file = screenshot
      ? new File([new Uint8Array(screenshot.buffer)], decodeUploadName(screenshot.originalname), {
          type: screenshot.mimetype
        })
      : undefined;

    await this.feedback.reportProblem({ input: { ...body, screenshot: file }, userId });

    return { ok: true };
  }
}
