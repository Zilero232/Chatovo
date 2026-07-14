import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { DomainEvent } from '../../common/events/domain-events';
import {
  notifyProblemReport,
  notifyRoomCreated,
  notifyRoomDeleted,
  notifyUserSignup,
  notifyVoiceEmpty,
  notifyVoiceJoin,
} from '../telegram';

import type {
  ProblemReportedEvent,
  RoomCreatedEvent,
  RoomDeletedEvent,
  UserSignedUpEvent,
  VoiceEmptiedEvent,
  VoiceJoinedEvent,
} from '../../common/events/domain-events';

@Injectable()
export class TelegramListener {
  private readonly logger = new Logger(TelegramListener.name);

  private async run(label: string, task: Promise<unknown>) {
    try {
      await task;
    } catch (error) {
      this.logger.warn(`Telegram notification "${label}" failed: ${String(error)}`);
    }
  }

  @OnEvent(DomainEvent.RoomCreated)
  onRoomCreated(event: RoomCreatedEvent) {
    return this.run('room.created', notifyRoomCreated(event));
  }

  @OnEvent(DomainEvent.RoomDeleted)
  onRoomDeleted(event: RoomDeletedEvent) {
    return this.run('room.deleted', notifyRoomDeleted(event));
  }

  @OnEvent(DomainEvent.UserSignedUp)
  onUserSignedUp(event: UserSignedUpEvent) {
    return this.run('user.signed-up', notifyUserSignup(event));
  }

  @OnEvent(DomainEvent.ProblemReported)
  onProblemReported(event: ProblemReportedEvent) {
    return this.run('problem.reported', notifyProblemReport(event));
  }

  @OnEvent(DomainEvent.VoiceJoined)
  onVoiceJoined(event: VoiceJoinedEvent) {
    return this.run('voice.joined', notifyVoiceJoin(event));
  }

  @OnEvent(DomainEvent.VoiceEmptied)
  onVoiceEmptied(event: VoiceEmptiedEvent) {
    return this.run('voice.emptied', notifyVoiceEmpty(event));
  }
}
