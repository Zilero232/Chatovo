import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TrackSource, WebhookReceiver } from 'livekit-server-sdk';
import { match } from 'ts-pattern';

import { DomainEvent } from '../../common/events/domain-events';
import { AppConfigService } from '../../config/config.module';
import { getRoomName } from '../../lib';
import {
  addParticipant,
  clearRoom,
  isMicMuted,
  parseParticipantMeta,
  patchParticipant,
  removeParticipant,
  syncRoom,
} from './presence';

import type { VoiceEmptiedEvent, VoiceJoinedEvent } from '../../common/events/domain-events';

@Injectable()
export class WebhookService {
  private readonly receiver: WebhookReceiver;

  constructor(
    config: AppConfigService,
    private readonly events: EventEmitter2,
  ) {
    this.receiver = new WebhookReceiver(
      config.get('LIVEKIT_API_KEY'),
      config.get('LIVEKIT_API_SECRET'),
    );
  }

  async handle(body: string, authHeader: string | undefined): Promise<void> {
    let event: Awaited<ReturnType<typeof this.receiver.receive>>;

    try {
      event = await this.receiver.receive(body, authHeader);
    } catch {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    // room.name carries our roomId — tokens are issued with `room: room.id`.
    // Every presence event is room-scoped, so without it there is nothing to do.
    const roomId = event.room?.name;

    if (!roomId) {
      return;
    }

    const participant = event.participant;
    const track = event.track;
    const isMicTrack = track?.source === TrackSource.MICROPHONE;

    await match(event.event)
      .with('participant_joined', async () => {
        if (participant) {
          const name = participant.name || participant.identity;

          addParticipant(roomId, {
            identity: participant.identity,
            name,
            micMuted: isMicMuted(participant.tracks),
            deafened: participant.attributes?.deafened === 'true',
            ...parseParticipantMeta(participant.metadata),
          });

          const roomName = await getRoomName(roomId);

          this.events.emit(DomainEvent.VoiceJoined, {
            roomId,
            roomName,
            participantName: name,
          } satisfies VoiceJoinedEvent);
        }
      })
      .with('participant_left', () => {
        if (participant) {
          removeParticipant(roomId, participant.identity);
        }
      })
      // LiveKit does NOT emit `track_muted` / `track_unmuted` webhooks — only the
      // publish lifecycle. Live mute toggles arrive via the explicit
      // POST /livekit/mic-state endpoint from the client instead.
      .with('track_published', () => {
        if (participant && isMicTrack && track) {
          patchParticipant(roomId, participant.identity, { micMuted: track.muted });
        }
      })
      .with('track_unpublished', () => {
        if (participant && isMicTrack) {
          patchParticipant(roomId, participant.identity, { micMuted: true });
        }
      })
      .with('room_finished', async () => {
        clearRoom(roomId);

        const roomName = await getRoomName(roomId);

        this.events.emit(DomainEvent.VoiceEmptied, { roomName } satisfies VoiceEmptiedEvent);
      })
      // Reconcile in case participant_joined events were missed before boot.
      .with('room_started', () => syncRoom(roomId))
      .otherwise(() => undefined);
  }
}
