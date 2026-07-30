import { Module } from '@nestjs/common';

import { FriendsController } from './friends.controller';
import { DmRoomService, FriendCallService, FriendshipService } from './services';

@Module({
  controllers: [FriendsController],
  providers: [FriendshipService, DmRoomService, FriendCallService],
  exports: [FriendshipService, DmRoomService, FriendCallService]
})
export class FriendsModule {}
