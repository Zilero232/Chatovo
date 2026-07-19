import type { ChatMessage, FriendUser } from '@chatovo/schemas';

export const DomainEvent = {
  RoomCreated: 'room.created',
  RoomDeleted: 'room.deleted',
  UserSignedUp: 'user.signed-up',
  ProblemReported: 'problem.reported',
  VoiceJoined: 'voice.joined',
  VoiceEmptied: 'voice.emptied',
  CallRinging: 'call.ringing',
  DmMessageSent: 'dm.message-sent',
} as const;

export type DomainEventPayloads = {
  [DomainEvent.RoomCreated]: {
    roomName: string;
    ownerName: string;
    isPrivate: boolean;
    password: string | null;
  };
  [DomainEvent.RoomDeleted]: {
    roomName: string;
    ownerName: string;
  };
  [DomainEvent.UserSignedUp]: {
    name: string;
    email: string;
  };
  [DomainEvent.ProblemReported]: {
    reporter: string;
    email: string;
    description: string;
    platform?: string;
    appVersion?: string;
  };
  [DomainEvent.VoiceJoined]: {
    roomId: string;
    roomName: string;
    participantName: string;
  };
  [DomainEvent.VoiceEmptied]: {
    roomName: string;
  };
  [DomainEvent.CallRinging]: {
    calleeId: string;
    caller: FriendUser;
    roomId: string;
  };
  [DomainEvent.DmMessageSent]: {
    recipientId: string;
    message: ChatMessage;
  };
};

export type RoomCreatedEvent = DomainEventPayloads[typeof DomainEvent.RoomCreated];
export type RoomDeletedEvent = DomainEventPayloads[typeof DomainEvent.RoomDeleted];
export type UserSignedUpEvent = DomainEventPayloads[typeof DomainEvent.UserSignedUp];
export type ProblemReportedEvent = DomainEventPayloads[typeof DomainEvent.ProblemReported];
export type VoiceJoinedEvent = DomainEventPayloads[typeof DomainEvent.VoiceJoined];
export type VoiceEmptiedEvent = DomainEventPayloads[typeof DomainEvent.VoiceEmptied];
export type CallRingingEvent = DomainEventPayloads[typeof DomainEvent.CallRinging];
export type DmMessageSentEvent = DomainEventPayloads[typeof DomainEvent.DmMessageSent];
