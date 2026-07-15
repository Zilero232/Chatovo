import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { isNullish } from 'remeda';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { assertCanAccessDmRoom } from '../../lib';
import { CreateRoomDto, RoomDto, UpdateRoomDto } from './dto/rooms.dto';
import { RoomsService } from './rooms.service';

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
  async getRoom(@Param('id') id: string, @CurrentUser() userId: string) {
    await assertCanAccessDmRoom(id, userId);
    const room = await this.rooms.getRoom(id);

    if (isNullish(room)) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  @Post()
  @ZodResponse({ status: 201, type: RoomDto })
  createRoom(@Body() body: CreateRoomDto, @CurrentUser() userId: string) {
    return this.rooms.createRoom(body, userId);
  }

  @Patch(':id')
  @ZodResponse({ type: RoomDto })
  updateRoom(@Param('id') id: string, @Body() body: UpdateRoomDto, @CurrentUser() userId: string) {
    return this.rooms.updateRoom(id, body, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteRoom(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.rooms.deleteRoom(id, userId);
  }
}
