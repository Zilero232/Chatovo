import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { DomainEvent } from '../../common/events/domain-events';
import { sendDmMessagePush, sendIncomingCallPush } from '../push/push-sender';

import type { CallRingingEvent, DmMessageSentEvent } from '../../common/events/domain-events';

@Injectable()
export class PushListener {
  private readonly logger = new Logger(PushListener.name);

  private async run(label: string, task: Promise<unknown>) {
    try {
      await task;
    } catch (error) {
      this.logger.warn(`Push notification "${label}" failed: ${String(error)}`);
    }
  }

  @OnEvent(DomainEvent.CallRinging)
  async onCallRinging(payload: CallRingingEvent) {
    await this.run('call.ringing', sendIncomingCallPush(payload));
  }

  @OnEvent(DomainEvent.DmMessageSent)
  async onDmMessageSent(payload: DmMessageSentEvent) {
    await this.run('dm.message-sent', sendDmMessagePush(payload));
  }
}
