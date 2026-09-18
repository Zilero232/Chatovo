import { Module } from '@nestjs/common';

import { ServersController } from './servers.controller';
import {
  BansService,
  InvitesService,
  MembersService,
  RolesService,
  ServersService
} from './services';

@Module({
  controllers: [ServersController],
  providers: [ServersService, MembersService, RolesService, InvitesService, BansService],
  exports: [ServersService, MembersService, RolesService, InvitesService, BansService]
})
export class ServersModule {}
