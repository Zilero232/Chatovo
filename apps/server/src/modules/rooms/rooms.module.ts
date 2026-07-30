import { Module } from '@nestjs/common';

import { RoomsController } from './rooms.controller';
import { RoomsService } from './services';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService]
})
export class RoomsModule {}
