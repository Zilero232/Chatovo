import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoomDto } from './dto/rooms.dto';
import { RoomsService } from './services';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Get(':id')
  @ZodResponse({ type: RoomDto })
  getRoom(@Param('id') roomId: string, @CurrentUser() userId: string) {
    return this.rooms.getRoom({ roomId, userId });
  }
}
