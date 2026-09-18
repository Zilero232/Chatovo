import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ThreadsService } from './services';

@ApiTags('thread-tags')
@Controller('thread-tags')
export class ThreadTagsController {
  constructor(private readonly threads: ThreadsService) {}

  @Delete(':id')
  @HttpCode(204)
  deleteThreadTag(@Param('id') tagId: string, @CurrentUser() userId: string) {
    return this.threads.deleteThreadTag({ tagId, userId });
  }
}
