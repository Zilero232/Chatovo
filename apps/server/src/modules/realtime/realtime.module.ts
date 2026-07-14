import { Module } from '@nestjs/common';

import { FriendsModule } from '../friends/friends.module';
import { initRealtimeBroadcast } from './connection-store';
import { RealtimeGateway } from './realtime.gateway';

initRealtimeBroadcast();

@Module({
  imports: [FriendsModule],
  providers: [RealtimeGateway],
})
export class RealtimeModule {}
