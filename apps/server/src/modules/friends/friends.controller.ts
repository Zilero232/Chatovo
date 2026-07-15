import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  FriendListDto,
  FriendRequestListDto,
  FriendUserDto,
  IncomingFriendCallResponseDto,
  OutgoingFriendCallResponseDto,
  RoomDto,
  SendFriendRequestDto,
} from './dto/friends.dto';
import { FriendsService } from './friends.service';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friends: FriendsService) {}

  @Get()
  @ZodResponse({ type: FriendListDto })
  listFriends(@CurrentUser() userId: string) {
    return this.friends.listFriends(userId);
  }

  @Get('requests/incoming')
  @ZodResponse({ type: FriendRequestListDto })
  listIncomingRequests(@CurrentUser() userId: string) {
    return this.friends.listIncomingRequests(userId);
  }

  @Get('relations/:userId')
  getRelation(@Param('userId') otherUserId: string, @CurrentUser() userId: string) {
    return this.friends.getFriendshipRelation(userId, otherUserId);
  }

  @Post('requests')
  sendRequest(@Body() body: SendFriendRequestDto, @CurrentUser() userId: string) {
    return this.friends.sendFriendRequest(userId, body.tag);
  }

  @Get('lookup/:tag')
  @ZodResponse({ type: FriendUserDto })
  findByTag(@Param('tag') tag: string) {
    return this.friends.findUserByTag(tag);
  }

  @Post('requests/:id/accept')
  acceptRequest(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.friends.acceptFriendRequest(userId, id);
  }

  @Post('requests/:id/decline')
  @HttpCode(204)
  declineRequest(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.friends.declineFriendRequest(userId, id);
  }

  @Delete(':userId')
  @HttpCode(204)
  removeFriendship(@Param('userId') otherUserId: string, @CurrentUser() userId: string) {
    return this.friends.removeFriendship(userId, otherUserId);
  }

  @Post(':userId/dm-room')
  @ZodResponse({ type: RoomDto })
  getOrCreateDmRoom(@Param('userId') otherUserId: string, @CurrentUser() userId: string) {
    return this.friends.getOrCreateDmRoom(userId, otherUserId);
  }

  @Post(':userId/call')
  @ZodResponse({ type: RoomDto })
  ringCall(@Param('userId') otherUserId: string, @CurrentUser() userId: string) {
    return this.friends.ringFriendCall(userId, otherUserId);
  }

  @Get('calls/incoming')
  @ZodResponse({ type: IncomingFriendCallResponseDto })
  getIncomingCall(@CurrentUser() userId: string) {
    return this.friends.getIncomingFriendCall(userId);
  }

  @Post('calls/accept')
  acceptIncomingCall(@CurrentUser() userId: string) {
    return this.friends.acceptIncomingFriendCall(userId);
  }

  @Post('calls/decline')
  @HttpCode(204)
  declineIncomingCall(@CurrentUser() userId: string) {
    return this.friends.declineIncomingFriendCall(userId);
  }

  @Post('calls/cancel')
  @HttpCode(204)
  cancelOutgoingCall(@CurrentUser() userId: string) {
    return this.friends.cancelOutgoingFriendCall(userId);
  }

  @Get('calls/outgoing')
  @ZodResponse({ type: OutgoingFriendCallResponseDto })
  getOutgoingCall(@CurrentUser() userId: string) {
    return this.friends.getOutgoingFriendCall(userId);
  }

  @Post('calls/ack')
  @HttpCode(204)
  ackOutgoingCall(@CurrentUser() userId: string) {
    return this.friends.ackOutgoingFriendCall(userId);
  }
}
