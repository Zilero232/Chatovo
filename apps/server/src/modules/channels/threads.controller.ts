import { Body, Controller, Delete, HttpCode, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ThreadDto, UpdateThreadDto } from './dto/channels.dto';
import { ThreadsService } from './services';

@ApiTags('threads')
@Controller('threads')
export class ThreadsController {
  constructor(private readonly threads: ThreadsService) {}

  @Patch(':id')
  @ZodResponse({ type: ThreadDto })
  updateThread(
    @Param('id') threadId: string,
    @Body() body: UpdateThreadDto,
    @CurrentUser() userId: string
  ) {
    return this.threads.updateThread({ threadId, input: body, userId });
  }

  @Delete(':id')
  @HttpCode(204)
  deleteThread(@Param('id') threadId: string, @CurrentUser() userId: string) {
    return this.threads.deleteThread({ threadId, userId });
  }
}
