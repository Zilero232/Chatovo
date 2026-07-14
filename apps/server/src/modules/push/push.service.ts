import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../core';

import type { RegisterPushDeviceInput, UnregisterPushDeviceInput } from '@chatovo/schemas';

@Injectable()
export class PushService {
  constructor(private readonly prisma: PrismaService) {}

  async registerPushDevice(userId: string, input: RegisterPushDeviceInput): Promise<void> {
    const { token, platform } = input;

    await this.prisma.pushDevice.upsert({
      where: { token },
      create: { userId, token, platform },
      update: { userId, platform },
    });
  }

  async unregisterPushDevice(userId: string, input: UnregisterPushDeviceInput): Promise<void> {
    const { token } = input;

    await this.prisma.pushDevice.deleteMany({ where: { userId, token } });
  }
}
