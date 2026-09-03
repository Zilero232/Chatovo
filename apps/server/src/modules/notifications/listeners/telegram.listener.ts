import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import type {
  AbuseReportedEvent,
  ProblemReportedEvent,
  RoomCreatedEvent,
  RoomDeletedEvent,
  UserBlockedEvent,
  UserSignedUpEvent,
  VoiceEmptiedEvent,
  VoiceJoinedEvent
} from '../../../common/events/domain-events';

import { DomainEvent } from '../../../common/events/domain-events';
import { runNotification } from '../../../common/notifications';
import {
  notifyAbuseReport,
  notifyProblemReport,
  notifyRoomCreated,
  notifyRoomDeleted,
  notifyUserBlocked,
  notifyUserSignup,
  notifyVoiceEmpty,
  notifyVoiceJoin
} from '../../telegram';

@Injectable()
export class TelegramListener {
  private readonly logger = new Logger(TelegramListener.name);

  private run(label: string, task: Promise<unknown>) {
    return runNotification({ logger: this.logger, channel: 'Telegram', label, task });
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

  @OnEvent(DomainEvent.AbuseReported)
  onAbuseReported(event: AbuseReportedEvent) {
    return this.run('abuse.reported', notifyAbuseReport(event));
  }

  @OnEvent(DomainEvent.UserBlocked)
  onUserBlocked(event: UserBlockedEvent) {
    return this.run('user.blocked', notifyUserBlocked(event));
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
