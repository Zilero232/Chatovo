import { Body, Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RegisterPushDeviceDto, UnregisterPushDeviceDto } from './dto/push.dto';
import { PushService } from './push.service';

@ApiTags('push')
@Controller('push')
export class PushController {
  constructor(private readonly push: PushService) {}

  @Post('devices')
  @HttpCode(204)
  registerDevice(@Body() body: RegisterPushDeviceDto, @CurrentUser() userId: string) {
    return this.push.registerPushDevice(userId, body);
  }

  @Delete('devices')
  @HttpCode(204)
  unregisterDevice(@Body() body: UnregisterPushDeviceDto, @CurrentUser() userId: string) {
    return this.push.unregisterPushDevice(userId, body);
  }
}
