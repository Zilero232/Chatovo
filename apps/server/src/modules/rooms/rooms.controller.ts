import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateRoomDto, RoomDto, UpdateRoomDto } from './dto/rooms.dto';
import { RoomsService } from './services';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Get()
  @ZodResponse({ type: [RoomDto] })
  listRooms() {
    return this.rooms.listRooms();
  }

  @Get(':id')
  @ZodResponse({ type: RoomDto })
  getRoom(@Param('id') roomId: string, @CurrentUser() userId: string) {
    return this.rooms.getRoom({ roomId, userId });
  }

  @Post()
  @ZodResponse({ status: 201, type: RoomDto })
  createRoom(@Body() body: CreateRoomDto, @CurrentUser() userId: string) {
    return this.rooms.createRoom({ input: body, ownerId: userId });
  }

  @Patch(':id')
  @ZodResponse({ type: RoomDto })
  updateRoom(
    @Param('id') roomId: string,
    @Body() body: UpdateRoomDto,
    @CurrentUser() userId: string
  ) {
    return this.rooms.updateRoom({ roomId, input: body, userId });
  }

  @Delete(':id')
  @HttpCode(204)
  deleteRoom(@Param('id') roomId: string, @CurrentUser() userId: string) {
    return this.rooms.deleteRoom({ roomId, userId });
  }
}
