import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import type { CallRingingEvent, DmMessageSentEvent } from '../../../common/events/domain-events';

import { DomainEvent } from '../../../common/events/domain-events';
import { runNotification } from '../../../common/notifications';
import { sendDmMessagePush, sendIncomingCallPush } from '../../push';

@Injectable()
export class PushListener {
  private readonly logger = new Logger(PushListener.name);

  private run(label: string, task: Promise<unknown>) {
    return runNotification({ logger: this.logger, channel: 'Push', label, task });
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
